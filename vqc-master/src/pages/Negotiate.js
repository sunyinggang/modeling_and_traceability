import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { ForceGraph2D } from 'react-force-graph';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getData, postData } from '../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { negotiateStep1Result, negotiateStep2Result } from '../redux/actions';
import tableform from '../utils/table';

const host = 'http://60.205.188.102:16012';
const page1TempData = {
  headers: [],
  datas: [],
};

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 1000,
    minWidth: 800,
    marginTop: 30,
  },
  dialog: {
    width: 500,
  },
  fixcontainer: {
    //background: '#000000',
    top: 100,
    left: 20,
    zIndex: 3,
    position: 'fixed',
    width: 300,
  },
  input: {
    width: 200,
    margin: 20,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Step1() {
  const classes = useStyles();
  const [page1Data, setPage1Data] = useState(page1TempData);
  const [page1Result, setPage1Result] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(1);

  const { step1Result } = useSelector(state => ({
    step1Result: state.negotiate.step1Result,
  }));

  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    async function fetchData() {
      let data = await getData(`${host}/negotiate/initialise/`);
      console.log('output');
      for (let i = 0; i < data.datas.length; i++) {
        for (let j = 0; j < data.datas[i].相关参与者设定参数.length; j++) {
          data.datas[i].相关参与者设定参数[j].value = '';
        }
      }
      console.log(data);
      setPage1Data(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let tempResult = [];
    page1Data.datas.forEach(item => {
      tempResult.push({
        id: item.id,
        args: item.相关参与者设定参数.map(s => Number(s.value)),
      });
    });
    setPage1Result(tempResult);
  }, [page1Data]);

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              {page1Data.headers.map(col => {
                if (col === '相关参与者设定参数')
                  return <TableCell align="right">{col}</TableCell>;
                if (col === '当前取值' || col === '单位')
                  return <TableCell align="right">{col}</TableCell>;
                return <TableCell align="center">{col}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {page1Data.datas.map(row => (
              <TableRow key={row.id}>
                {page1Data.headers.map(col => {
                  if (col === '相关参与者设定参数')
                    return (
                      <TableCell align="right">
                        <Button
                          className={classes.formButton}
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setIndex(row.id);
                            handleClickOpen();
                          }}
                        >
                          设定参数
                        </Button>
                      </TableCell>
                    );
                  if (col === '当前取值' || col === '单位')
                    return <TableCell align="right">{row[col]}</TableCell>;
                  return <TableCell align="center">{row[col]}</TableCell>;
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <Button
                  className={classes.formButton}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    dispatch(
                      negotiateStep1Result(
                        JSON.parse(JSON.stringify(page1Result))
                      )
                    );
                    history.push('/negotiate/step2');
                  }}
                >
                  开始协商
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">设定参数</DialogTitle>
        <DialogContent>
          {page1Data.datas.length > 0 &&
            page1Data.datas
              .find(item => item.id === index)
              .相关参与者设定参数.map(row => (
                <TextField
                  margin="dense"
                  id={row.name}
                  value={row.value}
                  label={row.name}
                  onChange={e => {
                    row.value = e.target.value;
                    setPage1Data(JSON.parse(JSON.stringify(page1Data)));
                  }}
                  type="number"
                  fullWidth
                />
              ))}

          <div className={classes.dialog}></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function Step2() {
  const dispatch = useDispatch();
  const { step1Result, step2Result } = useSelector(state => ({
    step1Result: state.negotiate.step1Result,
    step2Result: state.negotiate.step2Result,
  }));
  const [data, setData] = useState({ nodes: [], links: [], sequence: [] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('step2!!', step1Result);
    let a = [
      { id: 1, args: [0.2, 1.5, 10] },
      { id: 2, args: [5, 1.5, 10] },
      { id: 3, args: [5, 1.5, 10] },
      { id: 4, args: [50, 1.5, 10] },
      { id: 5, args: [50, 1.5, 10] },
      { id: 6, args: [0.1, 1.5, 10] },
    ];
    async function fetchData() {
      setLoading(true);
      let status = await postData(
        `${host}/negotiate/parameters1/`,
        step1Result
      );
      let data = await postData(`${host}/negotiate/show/`, step2Result);
      setLoading(false);
      console.log('datadata', data);
      setData({
        nodes: data.dots.map(dot => ({
          id: dot.id,
          color: 'pink',
          table: data.tables.find(item => item.id === dot.id)
            ? data.tables.find(item => item.id === dot.id).table
            : null,
        })),
        links: data.edges.map(item => ({ ...item, particles: 4 })),
        sequence: data.sequence,
      });
    }
    fetchData();
  }, [step1Result]);

  useEffect(() => {
    console.log('参数变化-->', step2Result.rounds, step2Result.t);
    async function fetchData() {
      let data = await postData(`${host}/negotiate/show/`, step2Result);
      console.log('datadata', data);
      setData({
        nodes: data.dots.map(dot => ({
          id: dot.id,
          color: 'pink',
          table: data.tables.find(item => item.id === dot.id)
            ? data.tables.find(item => item.id === dot.id).table
            : null,
        })),
        links: data.edges.map(item => ({ ...item, particles: 4 })),
        sequence: data.sequence,
      });
    }
    fetchData();
  }, [step2Result]);

  const classes = useStyles();
  const history = useHistory();

  const fgRef = useRef();
  useEffect(() => {
    fgRef.current.zoom(3, 1000);
    console.log('changing', data.sequence);
  }, [fgRef]);

  function sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }
  async function changeColor(array) {
    const dots = array;
    for (
      let i = 0, dot = dots[i], nextDot = dots[i + 1];
      i < dots.length;
      dot = dots[++i], nextDot = dots[i + 1]
    ) {
      let tempNodes = data.nodes;
      let curNode = tempNodes.find(item => item.id === dot);
      curNode.color = '#000000';
      fgRef.current.centerAt(curNode.x, curNode.y, 500);
      setData(() => {
        console.log('dot->nextDot', dot, nextDot);
        let tempLinks = data.links;
        let curLink = tempLinks.find(
          link => link.source.id === dot && link.target.id === nextDot
        );
        console.log('curLink', curLink);
        if (curLink) {
          curLink.color = 'red';
        }
        //console.log(tempLinks);
        return {
          ...data,
          links: tempLinks,
        };
      });
      await sleep();
    }
  }
  return (
    <div className={classes.board}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        onNodeClick={(node, event) => {
          console.log(node);
        }}
        onNodeHover={(node, prevNode) => {
          console.log(node);
          if (node) node.color = 'red';
          if (prevNode) prevNode.color = 'pink';
          console.log(prevNode);
        }}
        linkDirectionalParticleWidth={link => {
          return 2;
        }}
        nodeRelSize={8}
        linkWidth={1}
        linkCurvature={0.2}
        nodeLabel={node => {
          if (!node.table) return '无表格';
          console.log('table sheet', node.table);
          console.log('table node', tableform(node.table));
          console.log('stringstring', JSON.stringify(node.table));
          return tableform(node.table);
        }}
        onNodeDragEnd={node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 5;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            n => n + fontSize * 0.2 * 5
          ); // some padding
          ctx.fillStyle = node.color;
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y);
        }}
      ></ForceGraph2D>
      <Container className={classes.fixcontainer}>
        <Paper className={classes.paper}>
          <TextField
            className={classes.input}
            label="协商轮数"
            type="number"
            value={step2Result.rounds}
            onChange={e => {
              let tempResult = JSON.parse(JSON.stringify(step2Result));
              tempResult.rounds = Number(e.target.value);
              dispatch(negotiateStep2Result(tempResult));
            }}
            fullWidth
          ></TextField>
          <TextField
            className={classes.input}
            label="协商次数"
            type="number"
            value={step2Result.t}
            onChange={e => {
              let tempResult = JSON.parse(JSON.stringify(step2Result));
              tempResult.t = Number(e.target.value);
              dispatch(negotiateStep2Result(tempResult));
            }}
            fullWidth
          ></TextField>
          <Button
            color="primary"
            className={classes.input}
            onClick={() => {
              history.push('/negotiate/step3');
            }}
          >
            协商结果
          </Button>
        </Paper>
      </Container>
    </div>
  );
}

function Step3() {
  const classes = useStyles();
  const [table, setTable] = useState({
    headers: [],
    datas: [],
  });
  useEffect(() => {
    async function fetchData() {
      let data = await getData(`${host}/negotiate/balance/`);
      console.log(data);
      setTable(data);
    }
    fetchData();
  }, []);
  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              {table.headers.map(col => {
                return (
                  <TableCell key={col} align="center">
                    {col}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.datas.map(row => (
              <TableRow>
                {table.headers.map(col => {
                  return <TableCell align="center">{row[col]}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
function Negotiate() {
  const matches = {
    step1: useRouteMatch({
      path: '/negotiate/step1',
      strict: true,
      sensitive: true,
    }),
    step2: useRouteMatch({
      path: '/negotiate/step2',
      strict: true,
      sensitive: true,
    }),
    step3: useRouteMatch({
      path: '/negotiate/step3',
      strict: true,
      sensitive: true,
    }),
  };

  const { step1Result } = useSelector(state => ({
    step1Result: state.negotiate.step1Result,
  }));

  useEffect(() => {
    console.log('redux!!', step1Result);
  }, [step1Result]);
  return (
    <>
      {matches.step1 && <Step1></Step1>}
      {matches.step2 && <Step2></Step2>}
      {matches.step3 && <Step3></Step3>}
    </>
  );
}

export default Negotiate;

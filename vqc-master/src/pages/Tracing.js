import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { ForceGraph2D } from 'react-force-graph';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getData, postData } from '../utils/request';

import { useDispatch, useSelector } from 'react-redux';
import tableform from '../utils/table';
import {
  setTitle,
  modelStep1,
  modelStep1Result,
  modelStep2,
  modelStep2Result,
  modelStep3,
  modelStep3Result,
  modelStep4Result,
  tracingStep1,
  tracingStep1Result,
} from '../redux/actions';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

const host = 'http://39.98.49.111:16010';
// const host = 'http://127.0.0.1:8000';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 800,
    height: 400,
    overflow: 'auto',
    paddingTop: 30,
    paddingLeft: 30,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: 500,
  },
  con: { margin: '10px auto', width: '1000px', position: 'relative' },
  stepCon: { position: 'absolute', left: 120 },
  step2paper: { maxWidth: 1300, margin: '10px auto' },
  table: {
    minWidth: 1200,
  },
  tableInput: {
    marginBottom: 15,
    width: 50,
    height: 10,
  },
  resize: {
    fontSize: 13,
  },
  formControl: {
    minWidth: 400,
    maxWidth: 400,
    height: 55,
    marginBottom: 15,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};

const names = ['Y类型指标1', 'Y类型指标2', 'Y类型指标3'];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Step1Card() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const { step1, step1Result } = useSelector(state => ({
    step1: state.tracing.step1,
    step1Result: state.tracing.step1Result,
  }));

  useEffect(() => {
    async function fetchData() {
      console.log(step1Result);
      let b = await getData(`${host}/trace/monitoring/`);
      dispatch(tracingStep1(b));
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('step1result', step1Result);
  }, [step1Result]);

  return (
    <Paper className={classes.step2paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {step1.map(row => (
            <TableRow key={row.name}>
              {row.map((col, colIndex) => {
                if (colIndex === row.length - 1) {
                  return (
                    <TableCell component="th" scope="row">
                      {col === 1 ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            dispatch(tracingStep1Result(row));
                            history.push('/tracing/step2');
                          }}
                        >
                          开始溯源
                        </Button>
                      ) : (col === '溯源'?('溯源'): (
                        <Button variant="outlined" color="primary" disabled>
                          开始溯源
                        </Button>
                      ))}
                    </TableCell>
                  );
                }
                if (colIndex === row.length - 2) {
                  return (
                    <TableCell component="th" scope="row">
                      {col === 0 ? (
                        '未异常'
                      ) : (col === '是否异常'?('是否异常'): (
                        <p style={{ color: 'red' }}>发现异常</p>
                      ))}
                    </TableCell>
                  );
                }
                return (
                  <TableCell component="th" scope="row">
                    {col}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}


function rgbColor(){
  let r = Math.floor(Math.random()*256);
  let g = Math.floor(Math.random()*256);
  let b = Math.floor(Math.random()*256);
  let rgb = `rgb(${r},${g},${b})`;
  return rgb;
}

function Step2Card() {
  const dispatch = useDispatch();
  const { step1Result } = useSelector(state => ({
    step1Result: state.tracing.step1Result,
  }));
  const [data, setData] = useState({ nodes: [], links: [], sequence: [] });
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    console.log('step2!!', step1Result);
    async function fetchData() {
      let data = await postData(`${host}/trace/tracegraph/`, step1Result);
      console.log(data);
      setData({
        nodes: data.dots.map(dot => ({
          id: dot.id,
          color: 'green',
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

  const classes = useStyles();

  const fgRef = useRef();
  useEffect(() => {
    fgRef.current.zoom(4, 1000);
    console.log('changing', data.sequence);
  }, [fgRef]);

  useEffect(() => {
    if (!played && data.sequence.length) {
      console.log('hahaha', data);
      changeColor(data.sequence);
      setPlayed(true);
    }
  }, [data]);
  function sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }

  async function changeColor(array) {
    const dotss=array;
    for(let j = 0,dots=dotss[j];j<dotss.length;dots = dotss[++j]){
      let color =rgbColor();
      for (
        let i = 0, dot = dots[i], nextDot = dots[i + 1];
        i < dots.length;
        dot = dots[++i], nextDot = dots[i + 1]
      ) {
        let tempNodes = data.nodes;
        let curNode = tempNodes.find(item => item.id === dot);
        curNode.color = color;
        fgRef.current.centerAt(curNode.x, curNode.y, 500);
        setData(() => {
          console.log('dot->nextDot', dot, nextDot);
          let tempLinks = data.links;
          let curLink = tempLinks.find(
            link => link.source.id === dot && link.target.id === nextDot
          );
          console.log('curLink', curLink);
          if (curLink) {
            curLink.color = 'blue';
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
  }
  return (
    <div className={classes.board}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        // linkDirectionalParticles={link => link.particles}
        // linkDirectionalParticleSpeed={0}
        linkDirectionalArrowLength={6}
        onNodeClick={(node, event) => {
          console.log(node);
        }}
        // onNodeHover={(node, prevNode) => {
        //   console.log(node);
        //   if (node) node.color = 'blue';
        //   if (prevNode) prevNode.color = 'pink';
        //   console.log(prevNode);
        // }}
        linkDirectionalParticleWidth={link => {
          return 2;
        }}
        nodeRelSize={8}
        linkWidth={2}
        linkCurvature={0.1}
        nodeLabel={node => {
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
    </div>
  );
}

function Tracing() {
  const classes = useStyles();
  const history = useHistory();
  let matches = {
    step1: useRouteMatch({
      path: '/tracing/step1',
      strict: true,
      sensitive: true,
    }),
    step2: useRouteMatch({
      path: '/tracing/step2',
      strict: true,
      sensitive: true,
    }),
  };
  const [step, setStep] = useState(0);
  useEffect(() => {
    switch (step) {
      case 0:
        history.push('/tracing/step1');
        break;
      default:
        history.push('/tracing/step1');
    }
  }, [step]);
  const theme = useTheme();

  const { count } = useSelector(state => ({
    count: state.hello.counter,
  }));
  const dispatch = useDispatch();

  return (
    <>
      {matches.step1 && <Step1Card />}
      {matches.step2 && <Step2Card />}
    </>
  );
}

export default Tracing;

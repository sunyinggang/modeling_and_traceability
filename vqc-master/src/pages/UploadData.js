import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  paper: {
    width: '800px',
    margin: '50px auto'
  },
  enter: {
    width: '500px',
    height: '40px'
  },
  row: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

export default function SimpleTable() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>名称</TableCell>
            <TableCell align='right'>上传</TableCell>
            <TableCell align='right'>查看</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            { name: '价值期望' },
            { name: '质量参数' },
            { name: '相关性函数' },
            { name: '自相关函数' }
          ].map(row => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>
                <Button variant='outlined' color='primary'>
                  上传
                </Button>
              </TableCell>
              <TableCell align='right'>
                <Button variant='outlined' color='primary'>
                  查看
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.row}>
        <Button
          className={classes.enter}
          variant='contained'
          color='primary'
          onClick={() => {
            history.push('/');
          }}
        >
          确定
        </Button>
      </div>
    </Paper>
  );
}

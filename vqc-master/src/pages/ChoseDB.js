import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '330px',
    margin: '30px auto'
  },
  formControl: {
    margin: theme.spacing(1),
    width: '250px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  submitButton: {
    marginTop: '300px',
    width: '250px'
  }
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [s, setS] = React.useState(0);

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='disabled tabs example'
        >
          <Tab label='选择数据库' {...a11yProps(0)} />
          <Tab label='新建数据库' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <FormControl className={classes.formControl}>
          <InputLabel id='demo-simple-select-label'>选择数据库</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={s}
            onChange={event => {
              setS(event.target.value);
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(item => (
              <MenuItem value={item}>数据库{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          className={classes.submitButton}
          color='primary'
          onClick={() => {
            history.push('/uploaddata');
          }}
        >
          提交
        </Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}

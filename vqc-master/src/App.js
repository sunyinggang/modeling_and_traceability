import React, { useState } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import Modeling from './pages/Modeling'
import Tracing from './pages/Tracing'
import GraphTest from './pages/GraphTest'
import ModelGraph from './pages/ModelGraph'
import Home from './pages/Home'
import Negotiate from './pages/Negotiate'
import Login from './pages/Login'
import Register from './pages/Register'
import ChoseDB from './pages/ChoseDB'
import UploadData from './pages/UploadData'

import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from './redux/actions'

import styled from 'styled-components'

const useStyles = makeStyles((theme) => ({
  App: {
    minWidth: 1300,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    width: '500px',
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#000000',
  },
  appBar: {
    minWidth: 1300,
    background: '#81c784',
  },
  box: {
    background: '#000000',
    width: '100px',
    height: '100px',
    position: 'absolute',
    zIndex: '2',
  },
  chart: {},
  board: {
    position: 'relative',
  },
}))

const Bar = styled.div`
  position: relative;
  width: 100vw;
  height: 82px;
  background-color: #eee;
  display: grid;
  grid-template-columns: 100px 1fr 200px;
  box-sizing: border-box;
  padding: 0 20px;
`

const Logo = styled.div`
  height: 60px;
  background-image: url('/logojt.png');
  width: 200px;
  background-size: cover;
  align-self: center;
`

const Middle = styled.div``

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

const AButton = styled.div`
  width: 80px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #2e2a56;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background-color: #2e2a56;
  }
`

const BButton = styled.div`
  width: 80px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #000;
  position: relative;
`

function App() {
  const classes = useStyles()
  let matches = {
    index: useRouteMatch({
      path: '/',
      exact: true,
    }),
    login: useRouteMatch({
      path: '/login',
      exact: true,
    }),
    register: useRouteMatch({
      path: '/register',
      exact: true,
    }),
    chosedb: useRouteMatch({
      path: '/chosedb',
      exact: true,
    }),
    home: useRouteMatch({
      path: '/home',
      strict: true,
      sensitive: true,
    }),
    graphtest: useRouteMatch({
      path: '/graph',
      strict: true,
      sensitive: true,
    }),
    graphori: useRouteMatch({
      path: '/graphori',
      strict: true,
      sensitive: true,
    }),
    modeling: useRouteMatch({
      path: '/modeling',
      strict: true,
      sensitive: true,
    }),
    traceabiliting: useRouteMatch({
      path: '/tracing',
      strict: true,
      sensitive: true,
    }),
    modelgraph: useRouteMatch({
      path: '/modelgraph',
      strict: true,
      sensitive: true,
    }),
    negotiate: useRouteMatch({
      path: '/negotiate',
      strict: true,
      sensitive: true,
    }),
    uploaddata: useRouteMatch({
      path: '/uploaddata',
      strict: true,
    }),
  }

  const { barTitle } = useSelector((state) => ({
    barTitle: state.text.barTitle,
  }))
  const history = useHistory()
  const dispatch = useDispatch()
  return (
    <div className="App">
      <Bar>
        <Logo />
        <Middle />
        <ActionContainer>
          <AButton>首页</AButton>
          <BButton>解决方案</BButton>
        </ActionContainer>
      </Bar>
      {matches.index && <Home />}
      {matches.login && <Login />}
      {matches.register && <Register />}
      {matches.graphtest && <GraphTest />}
      {matches.modeling && <Modeling />}
      {matches.traceabiliting && <Tracing />}
      {matches.modelgraph && <ModelGraph />}
      {matches.negotiate && <Negotiate />}
      {matches.chosedb && <ChoseDB />}
      {matches.uploaddata && <UploadData />}
    </div>
  )
}

export default App

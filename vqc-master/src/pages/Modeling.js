import React, { useState, useEffect, useRef } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getData, postData } from '../utils/request'

import { useDispatch, useSelector } from 'react-redux'
import {
  setTitle,
  modelStep1,
  modelStep1Result,
  modelStep2,
  modelStep2Result,
  modelStep3,
  modelStep3Result,
  modelStep4Result,
} from '../redux/actions'

import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Check from '@material-ui/icons/Check'
import StepConnector from '@material-ui/core/StepConnector'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'

const host = 'http://39.98.49.111:16009'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 300,
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
  step2paper: { width: 700, margin: '10px auto' },
  table: {
    minWidth: 650,
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
}))

function getSteps() {
  return ['第一步', '第二步', '第三步', '第四步']
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return '说明：上面展示为系统预设的指标类型，可以通过多选并转移自定义指标类型，点击下一步完成提交修改'
    case 1:
      return '说明：此处为Y类型指标的离散分界值，每一项均为必填项，点击下一步完成提交'
    case 2:
      return ''
    default:
      return ''
  }
}

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#9ccaf5',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#9ccaf5',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector)

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#9ccaf5',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#9ccaf5',
    zIndex: 1,
    fontSize: 18,
  },
})

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles()
  const { active, completed } = props

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  )
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
}

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

/**
 * step1
 */
function TransferList() {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const [left, setLeft] = React.useState([
    { id: 0, name: 'A' },
    { id: 1, name: 'B' },
    { id: 2, name: 'C' },
    { id: 3, name: 'D' },
  ])
  const [right, setRight] = React.useState([
    { id: 4, name: 'E' },
    { id: 5, name: 'F' },
    { id: 6, name: 'G' },
    { id: 7, name: 'H' },
  ])

  const dispatch = useDispatch()
  const { step1, step1result } = useSelector((state) => ({
    step1: state.model.step1,
    step1result: state.model.step1result,
  }))

  useEffect(() => {
    async function fetchData() {
      let a = await getData(`${host}/model/getvar/`)
      dispatch(modelStep1(a))
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    setLeft(step1.filter((item) => item.type === 'x'))
    setRight(step1.filter((item) => item.type === 'y'))

    dispatch(modelStep1Result(step1))
  }, [step1])

  useEffect(() => {
    let tempResult = []
    tempResult.push(
      ...left.map((item) => {
        item.type = 'x'
        return item
      }),
      ...right.map((item) => {
        item.type = 'y'
        return item
      })
    )
    dispatch(modelStep1Result(tempResult))
  }, [left, right, dispatch])

  //load data

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    console.log(step1result)
  }

  const handleCheckedRight = async () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const GreenCheckbox = withStyles({
    root: {
      color: '#666666',
      '&$checked': {
        color: '#9ccaf5',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />)

  const customList = (items, title) => (
    <Paper className={classes.paper}>
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <GreenCheckbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Paper>
  )

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>{customList(left, '指标X')}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right, '指标Y')}</Grid>
    </Grid>
  )
}

/**
 * step2
 */

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('下单等待时间', 159, 6.0, 24, '正向'),
  createData('商品价格', 237, 9.0, 37, '负向'),
]

function Step2Card() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { step1result, step2, step2result } = useSelector((state) => ({
    step1result: state.model.step1result,
    step2: state.model.step2,
    step2result: state.model.step2result,
  }))

  useEffect(() => {
    async function fetchData() {
      console.log(step1result)
      let b = await postData(`${host}/model/classfication/`, step1result)
      dispatch(modelStep2(b))
    }
    fetchData()
  }, [])

  useEffect(() => {
    console.log('step2', step2)
    dispatch(
      modelStep2Result(
        step2.map((item) => {
          item.disv = null
          return item
        })
      )
    )
  }, [step2, dispatch])

  useEffect(() => {
    console.log('changed', step2result)
  }, [step2result])
  return (
    <Paper className={classes.step2paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>指标名称</TableCell>
            <TableCell>临界值</TableCell>
            <TableCell align="right">最小值</TableCell>
            <TableCell align="right">最大值</TableCell>
            <TableCell align="right">极性</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {step2.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="请输入"
                  className={classes.tableInput}
                  onChange={(e) => {
                    //console.log(step2result);
                    step2result.find(
                      (item) => item.id === row.id
                    ).disv = Number(e.target.value)
                    dispatch(
                      modelStep2Result(JSON.parse(JSON.stringify(step2result)))
                    )
                  }}
                  InputProps={{
                    classes: {
                      input: classes.resize,
                    },
                  }}
                />
              </TableCell>
              <TableCell align="right">{row.min}</TableCell>
              <TableCell align="right">{row.max}</TableCell>
              <TableCell align="right">{row.dir}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

/**
 * step3
 */

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
}

const names = ['Y类型指标1', 'Y类型指标2', 'Y类型指标3']

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}
const step3rows = [
  {
    name: '哈哈哈',
    value: ['1', '2'],
    selected: [],
  },
  {
    name: '嘤嘤嘤',
    value: ['3', '4'],
    selected: [],
  },
]

function Step3Card() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { step2result, step3, step3result } = useSelector((state) => ({
    step2result: state.model.step2result,
    step3: state.model.step3,
    step3result: state.model.step3result,
  }))
  useEffect(() => {
    console.log('step3 init', step2result)
    async function fetchData() {
      console.log('step3 fetching')
      let data = await postData(`${host}/model/dis-y/`, step2result)
      console.log(data.x)
      let steptemp = data.x.map((item) => {
        item.selected = item.rel
        item.rel = data.y.map((item) => item.name)
        return item
      })
      dispatch(modelStep3(steptemp))

      let tempResult = JSON.parse(JSON.stringify(steptemp))

      dispatch(
        modelStep3Result(
          tempResult.map((item) => {
            item.rel = item.selected
            return item
          })
        )
      )
    }
    fetchData()
  }, [])
  const theme = useTheme()

  const handleChange = (event, name) => {
    //setPersonName(event.target.value);
    console.log('change', name)
    let tempRows = JSON.parse(JSON.stringify(step3))
    tempRows.find((row) => row.name === name).selected = event.target.value
    console.log('step3 changed', tempRows)
    dispatch(modelStep3(tempRows))
    let tempResult = JSON.parse(JSON.stringify(step3))
    tempResult.find((row) => row.name === name).rel = event.target.value
    dispatch(modelStep3Result(tempResult))
  }

  return (
    <Paper className={classes.step2paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>指标名称</TableCell>
            <TableCell>关联指标</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {step3.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                <FormControl className={classes.formControl}>
                  <InputLabel id={row.name}>
                    {row.rel.length ? '请选择Y类型指标' : '空指标'}
                  </InputLabel>
                  <Select
                    disabled={row.rel.length ? false : true}
                    labelId={row.name}
                    id={row.name}
                    multiple
                    value={row.selected}
                    onChange={(e) => {
                      console.log('before change', step3)
                      handleChange(e, row.name)
                      console.log('after change', step3)
                    }}
                    input={<Input id={row.name} />}
                    renderValue={(selected) => {
                      console.log(selected)
                      return (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )
                    }}
                    MenuProps={MenuProps}
                  >
                    {row.rel.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, row.rel, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

/**
 * step4
 */
const step4Style = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))
function Step4Card() {
  const classes = useStyles()
  const theme = step4Style()

  const dispatch = useDispatch()

  const { step3result, step4result } = useSelector((state) => ({
    step3result: state.model.step3result,
    step4result: state.model.step4result,
  }))

  useEffect(() => {
    console.log('step4 init', step3result)
    async function fetch() {
      let a = {
        x: step3result,
      }
      console.log(a)
      await postData(`${host}/model/relation-x-y/`, a)
    }
    fetch()
    dispatch(modelStep4Result({ method: 'k2-2', nodes: null }))
  }, [])

  useEffect(() => {
    console.log('!!--!!', step4result)
  }, [step4result])

  const [age, setAge] = useState('')
  const [params, setParams] = useState([])

  const handleChange = (event) => {
    dispatch(modelStep4Result({ ...step4result, method: event.target.value }))
  }

  return (
    <Paper className={classes.step2paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>参数名称</TableCell>
            <TableCell>参数数值</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="methods">
            <TableCell component="th" scope="row">
              方法选择
            </TableCell>
            <TableCell>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">选择方法</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={step4result.method}
                  onChange={handleChange}
                >
                  <MenuItem value={'k2-2'}>k2-2</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow key="methods1">
            <TableCell component="th" scope="row">
              每个节点最大父节点数
            </TableCell>
            <TableCell>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-basic"
                  label="节点数"
                  onChange={(e) => {
                    dispatch(
                      modelStep4Result({
                        ...step4result,
                        nodes: Number(e.target.value),
                      })
                    )
                  }}
                />
              </FormControl>
            </TableCell>
          </TableRow>
          {params.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function Modeling() {
  const classes = useStyles()
  const dispatch = useDispatch()

  let matches = {
    step1: useRouteMatch({
      path: '/modeling/step1',
      strict: true,
      sensitive: true,
    }),
    step2: useRouteMatch({
      path: '/modeling/step2',
      strict: true,
      sensitive: true,
    }),
    step3: useRouteMatch({
      path: '/modeling/step3',
      strict: true,
      sensitive: true,
    }),
    step4: useRouteMatch({
      path: '/modeling/step4',
      strict: true,
      sensitive: true,
    }),
    graph: useRouteMatch({
      path: '/modeling/graph',
      strict: true,
      sensitive: true,
    }),
  }
  let history = useHistory()

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [isTitleChanged, setIsTitleChanged] = React.useState(false)
  const steps = getSteps()

  useEffect(() => {
    if (!isTitleChanged) {
      dispatch(setTitle('建模'))
      setIsTitleChanged(true)
    }
  })

  const prevStep = usePrevious(activeStep)
  console.log('prevstep', prevStep)

  useEffect(() => {
    switch (activeStep) {
      case 0:
        history.push('/modeling/step1')
        break
      case 1:
        history.push('/modeling/step2')
        break
      case 2:
        history.push('/modeling/step3')
        break
      case 3:
        history.push('/modeling/step4')
        break
      case 4:
        history.push('/modelgraph')
        break
      default:
        history.push('/modeling/step1')
    }
  }, [activeStep, history])

  const isStepOptional = (step) => {
    return false
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const ColorButton = withStyles((theme) => ({
    root: {
      color: '#ffffff',
      backgroundColor: '#9ccaf5',
      '&:hover': {
        backgroundColor: '#9ccaf5',
      },
    },
  }))(Button)

  return (
    <div className={classes.con}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {matches.step1 && <TransferList />}
      {matches.step2 && <Step2Card />}
      {matches.step3 && <Step3Card />}
      {matches.step4 && <Step4Card />}
      <div className={classes.stepCon}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <ColorButton
                variant="contained"
                disabled={activeStep === 0}
                color="primary"
                onClick={handleBack}
                className={classes.button}
              >
                上一步
              </ColorButton>

              <ColorButton
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? '完成' : '下一步'}
              </ColorButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modeling

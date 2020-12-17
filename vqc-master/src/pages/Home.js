import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useHistory } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    maxWidth: 300,
    margin: 20,
    transform: 'scale(0.7)',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  con: {
    display: 'flex',
  },
  media: {
    height: 0,
    paddingTop: '100%', // 16:9
  },
})

export default function SimpleCard() {
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>

  let history = useHistory()

  return (
    <div className={classes.con}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/b.png"
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            因果链模型构建
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              history.push('/modeling/step1')
            }}
          >
            进入
          </Button>
        </CardActions>
      </Card>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/a.png"
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            车间生产异常溯源
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              history.push('/tracing')
            }}
          >
            进入
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

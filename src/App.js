import React, {Component} from 'react'
import Dashboard from './components/Dashboard'
import {makeStyles} from '@material-ui/core/styles';

const useStyles  = makeStyles({
  helloThereStyle: {
    fontStyle: 'oblique'
  },
  board: {
    backgroundColor: '#fff'
  }

})

function App() {
  const classes = useStyles();

  return(
      <Dashboard />
      )
}

export default App;

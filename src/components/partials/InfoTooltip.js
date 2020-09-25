import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Tooltip} from '@material-ui/core'

const InfoTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  arrow: {
    color: theme.palette.common.black,
  },
}))(Tooltip);

export default InfoTooltip

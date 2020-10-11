import React, {Fragment, useRef, useState, useEffect, useCallback} from 'react'
import { makeStyles, withStyles} from '@material-ui/core/styles';

import SpeedDial from './partials/SpeedDial'
import DetailTb from './DetailsTb'
import HeaderTb from './HeaderTb';

import {FormControl, Select, MenuItem, TextField, ListItemIcon, Divider, CircularProgress,
        Button, Grid, IconButton} from '@material-ui/core'
import {Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete'

import InfoIcon from '@material-ui/icons/InfoOutlined';
import MaterialIcon from '@material-ui/icons/LocalMallRounded'
import ManoObraIcon from '@material-ui/icons/PanToolRounded'
import IndirectIcon from '@material-ui/icons/AllOutRounded'
import CheckIcon from '@material-ui/icons/Check';
import EditAttributesIcon from '@material-ui/icons/EditAttributesRounded';
import SpecialPriceIcon from '@material-ui/icons/StarRateRounded';

import MaterialCostTb from './costs/MaterialsCostTb'
import WorkforceCostTb from './costs/WorkforceCostTb'
import IndirectCostTb from './costs/IndirectCostTb'


import api from '../../api'


const useStyles = makeStyles((theme) => ({
  tableTotal: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginTop: theme.spacing(2)
    // float: 'right',
  },
  denseItem:{
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const CostTb = ({rowData, refreshRow: updateRow}) => {
  const classes = useStyles()
  const materialRef = useRef(null)
  const workforceRef = useRef(null)
  const indirectRef = useRef(null)

  const renderCount = useRef(1)

 const loading = !!rowData.totalCost;

 //Quantity for unit of the row
 const {unitAmount : rowAmount} = rowData

//Finance info from the row
 const {totalCost, directCost, indirectCost, materialCost, workForceCost} = rowData

//Inforacion del presupuesto y el renglon
 const {budget} = rowData
 const {id: budgetId} = budget
 const {id: rowId} = rowData
 const url = `rows/${rowId}`
 const rowUrl = `budgets/${budgetId}/${url}`

 const refreshRow = useCallback(() => updateRow(rowUrl, rowData), [])


const actions = [
       { icon: <MaterialIcon />, name: 'Material', onClick: () => materialRef.current.setState({ showAddRow: true }) },
       { icon: <ManoObraIcon />, name: 'Mano de Obra', onClick: () => workforceRef.current.setState({ showAddRow: true }) },
       { icon: <IndirectIcon />, name: 'Costo Indirecto', onClick: () => indirectRef.current.setState({ showAddRow: true }) },
     ];


    return (
      <Fragment>
      <MaterialCostTb total={materialCost} refreshRow={refreshRow} url={url} />
      <WorkforceCostTb total={workForceCost} refreshRow={refreshRow} url={url} rowAmount={rowAmount}/>
      <IndirectCostTb total={indirectCost} refreshRow={refreshRow} url={url} />
      <Table  aria-label="spanning table" className={classes.tableTotal}>
          <TableBody>
                <TableRow>
                   <PlainTableCell rowSpan={3} />
                   <TableCell colSpan={2}>Total Costos Directos</TableCell>
                   <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(directCost || 0)}</TableCell>
                </TableRow>
               <TableRow>
                  <TableCell colSpan={2}>Total Costos Indirectos</TableCell>
                  <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(indirectCost || 0)}</TableCell>
                </TableRow>
                 <TotalTableRow>
                    <PlainTableCell colSpan={2}>Total Costos del Renglon</PlainTableCell>
                    <PlainTableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(totalCost || 0)}</PlainTableCell>
                </TotalTableRow>
          </TableBody>
      </Table>
      </Fragment>


    )
}

export default React.memo(CostTb, (prev, next) => prev.rowData.totalCost == next.rowData.totalCost)

const TotalTableRow = withStyles((theme) => ({
  root: {
      // backgroundColor: theme.palette.primary.info,
      borderTop: `solid 2px ${theme.palette.primary.main}`,

  },
}))(TableRow);

const PlainTableCell = withStyles((theme) => ({
  root: {
    borderBottom: `none`,
  },
}))(TableCell);

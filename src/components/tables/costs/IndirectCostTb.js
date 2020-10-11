import React, {Fragment, forwardRef, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import api from '../../../api'
import {Table, TableBody, TableRow, TableCell, Button} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import DetailsTb from './DetailsTb'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterListRounded';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
const useStyles = makeStyles((theme) => ({
  tableTotal: {
    maxWidth: 400,
    marginLeft: 'auto',
    // float: 'right',
  },
  totalCell: {
    paddingRight: 95,
  },
}));


const IndirectCostTb = ({total, refreshRow, url}) => {

  const renderCount = useRef(1)
  const [units, setUnits] = useState({})
  useEffect(() => {
    api.get('units/catal')
    .then(response => {
      setUnits(response.data)
    })
    .catch(err => {

    })
  }, [])

   const getColumns = useCallback(() => ([
      { title: 'Id', field: 'id', hidden: true},
      { title: 'Costos Indirectos', field: 'name', width: '40%',
        validate: rowData => ( typeof rowData.name != 'undefined'?
                                   rowData.name.trim() === '' ?
                                       { isValid: false, helperText: 'Nombre es requerido' } : true
                                   : false)},
      { title: 'Cantidad', field: 'amount', type: 'numeric', render: rowData => rowData.amount.toFixed(2), width: '15%', align: 'right',
        validate: rowData => ( typeof rowData.amount != 'undefined'?
                                   rowData.amount.length <= 0 ?
                                       { isValid: false, helperText: 'Cantidad es requerido' } : true
                                   : false)},
      { title: 'Unidad', field: 'unit.id', lookup: units, width: '15%', align: 'right',
        validate: rowData => ( typeof rowData.unit != 'undefined')},
      { title: 'Precio Unitario', field: 'price', type: 'currency',
        currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2},
        validate: rowData => ( typeof rowData.price != 'undefined'?
                                   rowData.price.length <= 0 ?
                                       { isValid: false, helperText: 'Precio es requerido' } : true
                                   : false),
        width: '15%', align: 'right'},
      { title: 'Precio Total', field: 'totalPrice', type: 'currency', editable: 'never', width: '15%', align: 'right',
        render: rowData => typeof rowData != 'undefined' && new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(rowData.amount * rowData.price),
        currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}}

    ]), [units])
    const apiId = useMemo(()=> `${url}/indcosts`, [])

  return(
    <Fragment>
        <DetailsTb title="Costo indirecto" label="costo" color='#6c92a2' getColumns={getColumns}
         url={`${url}/indcosts`} refreshRow={refreshRow}/>
        <Resumen total={total}/>
    </Fragment>
  )
}

export default React.memo(IndirectCostTb)



const Resumen = React.memo(({total}) =>  {
  const classes = useStyles()

  return(
    <Table  aria-label="spanning table" className={classes.tableTotal}>
         <TableBody>
             <TotalTableRow>
                <PlainTableCell rowSpan={1} />
                <PlainTableCell colSpan={2}>Subtotal</PlainTableCell>
                <PlainTableCell className={classes.totalCell} align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(total || 0)}</PlainTableCell>
             </TotalTableRow>
         </TableBody>
     </Table> )})

const TotalTableRow = withStyles((theme) => ({
  root: {
      borderTop: `solid 2px #9ca9a8`,
  },
}))(TableRow);

const PlainTableCell = withStyles((theme) => ({
  root: {
    borderBottom: `none`,
  },
}))(TableCell);

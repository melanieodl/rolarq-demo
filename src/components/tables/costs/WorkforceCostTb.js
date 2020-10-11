import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react'
import api from '../../../api'
import {Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import DetailsTb from './DetailsTb'

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

const WorkForceCostTb = ({total, refreshRow, url, rowAmount}) => {
  const classes = useStyles()

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
      { title: 'Relativo', field: 'relative', type: 'boolean', width:'5%', initialEditValue: true },
      { title: 'Mano de Obra', field: 'name', width: '40%',
        validate: rowData => ( typeof rowData.name != 'undefined'?
                                   rowData.name.trim() === '' ?
                                       { isValid: false, helperText: 'Nombre es requerido' } : true
                                   : false)},
      { title: 'Cantidad', field: 'amount', type: 'numeric', initialEditValue: rowAmount,
        validate: rowData => ( typeof rowData.amount != 'undefined'?
                                   rowData.amount.length <= 0 ?
                                       { isValid: false, helperText: 'Cantidad es requerido' } : true
                                   : false),
        render: rowData => (rowData.amount).toFixed(2), width: '15%', align: 'right'},
      { title: 'Unidad', field: 'unit.id', lookup: units,
        validate: rowData => ( typeof rowData.unit != 'undefined'),
        width: '15%', align: 'right'},
      { title: 'Precio Unitario', field: 'price', type: 'currency',
        validate: rowData => ( typeof rowData.price != 'undefined'?
                                   rowData.price.length <= 0 ?
                                       { isValid: false, helperText: 'Precio es requerido' } : true
                                   : false),
        currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}, width: '15%', align: 'right'},
      { title: 'Precio Total', field: 'totalPrice', type: 'currency', editable: 'never', width: '15%', align: 'right',
        render: rowData => typeof rowData != 'undefined' && new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(rowData.amount * rowData.price),
        currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}}

    ]), [units])

  return(
    <Fragment>
        <DetailsTb title='Mano de Obra' label='mano de obra' color='#6c92a2' getColumns={getColumns}
         url={`${url}/wfcosts`} refreshRow={refreshRow}/>
         <Table  aria-label="spanning table" className={classes.tableTotal}>
             <TableBody>
                 <TotalTableRow>
                    <PlainTableCell rowSpan={1} />
                    <PlainTableCell colSpan={2}>Subtotal</PlainTableCell>
                    <PlainTableCell className={classes.totalCell} align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(total || 0)}</PlainTableCell>
                 </TotalTableRow>
             </TableBody>
         </Table>
    </Fragment>
  )
}

export default React.memo(WorkForceCostTb)

const TotalTableRow = withStyles((theme) => ({
  root: {
      borderTop: `solid 2px #6c92a2`,
  },
}))(TableRow);


const PlainTableCell = withStyles((theme) => ({
  root: {
    borderBottom: `none`,
  },
}))(TableCell);

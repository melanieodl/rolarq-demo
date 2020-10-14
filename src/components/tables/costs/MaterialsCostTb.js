import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react'
import api from '../../../api'
import {Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InfoTooltip from '../../partials/InfoTooltip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {FormControl, Select, MenuItem, TextField, CircularProgress, IconButton} from '@material-ui/core'
import DetailsTb from './DetailsTb'
import InfoIcon from '@material-ui/icons/InfoOutlined';
import SpecialPriceIcon from '@material-ui/icons/StarRateRounded';

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

const MaterialCostTb = ({total, refreshRow, url}) => {
  const classes = useStyles()

  const renderCount = useRef(1)
  const [units, setUnits] = useState({})
  const [options, setOptions] = useState([])
  const [priceList, setPriceList] = useState([])

  const loading = options.length == 0

   useEffect(() => {
     if (!loading) {
       return undefined;
     }
     api.get('materials')
     .then(response => {
       setOptions(response.data)
     })
     api.get('units/catal')
     .then(response => {
       setUnits(response.data)
     })
     .catch(err => {

     })
   }, [])

   const getColumns = useCallback(() => ([
     { title: 'Id', field: 'id', hidden: true},
     { width: '1%',  align: 'left', sorting: false, render: (rowData) =>  typeof rowData != 'undefined' && rowData.type && rowData.type.id != 1 &&
              <InfoTooltip title={rowData.type.name} placement="bottom">
                <IconButton  size='small' aria-label="upload picture" component="span">
                  <InfoIcon />
                </IconButton>
              </InfoTooltip>},
     { title: "Material", width: '35%',
      field: "material", render: rowData => rowData ? rowData.name : '',
      validate: rowData => ( typeof rowData.name != 'undefined'?
                                 rowData.name.trim() === '' ?
                                     { isValid: false, helperText: 'Nombre es requerido' } : true
                                 : false),
      editComponent: props => (
        <Autocomplete
          id="Agent Emails"
          fullWidth
          autoComplete
          autoSelect
          size="small"
          value={props.value}
          options={options}
          getOptionLabel={option => option.name}
          getOptionSelected={(option, value) => option.name === value.name}
          loading={loading}
          loadingText= 'Cargando...'
          clearText	= 'Borrar'
          getOptionDisabled={props.rowData ?
                                props.rowData.type ?
                                    props.rowData.type.id === 4 ?
                                        option => !option.type || option.prices.length <= 0 || option.type.id != props.rowData.material.type.id
                                        : option => option.prices.length <= 0
                                    :option => option.prices.length <= 0
                                : option => option.prices.length <= 0}
          renderInput={params => {
            {props.rowData && console.log(props.rowData)}

            return (
              <TextField
                placeholder={props.rowData ? props.rowData.name? `${props.rowData.name}` : `Seleccionar Material` : `Seleccionar Material`}
                {...params}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
          onChange={(e, newValue )=> {
          if(newValue != null){
            props.onChange(newValue)
            console.log(newValue);
            var data = { ...props.rowData };
                data.name = newValue.name ? newValue.name : ''
                data.unit = newValue.unit ? newValue.unit : null
                data.material = newValue
                data.prices = newValue.prices ? newValue.prices : []
                data.materialPrice = {price: ''}
                data.price = ''

                props.onRowDataChange(data);

          } else {
            var data = { ...props.rowData };

                data.prices = []

                props.onRowDataChange(data);
          }
          } }

        />
      )},
     { title: 'Cantidad', field: 'amount', type: 'numeric',
     render: rowData => (rowData.amount * (rowData.wastePct/100+1)).toFixed(2), width: '15%', align: 'right',
     validate: rowData => ( typeof rowData.amount != 'undefined'?
                                rowData.amount.length <= 0 ?
                                    { isValid: false, helperText: 'Cantidad es requerido' } : true
                                : false),
     editComponent: props => (
       <TextField id="standard-basic"
         value={props.value}
         type='number'
         size='small'
         disabled = {props.rowData && props.rowData.type && props.rowData.type.id === 4}
         onChange={e => props.onChange(e.target.value)}
        />

     )
     },
     { title: 'Pct.', field: 'wastePct', type: 'numeric', render: rowData => `${rowData.wastePct} %`, width: '5%', align: 'right',
     initialEditValue: 0,
     validate: rowData => ( typeof rowData.wastePct != 'undefined'?
                                rowData.wastePct.length <= 0 ?
                                    { isValid: false, helperText: 'Cantidad es requerido' } : true
                                : false),
      editComponent: props => <TextField defaultValue={0} type="number" inputProps={{min: 0, max: 100, fontSize: 10}}
      value={props.value} onChange={e => props.onChange(e.target.value)}/>},
     { title: 'Unidad', field: 'unit.id', lookup: units, editable: 'never', width: '15%', align: 'right',
       validate: rowData => ( typeof rowData.unit != 'undefined')},
     { title: 'Precio Unitario', field: 'materialPrice',  width: '15%', align: 'right',
       render: rowData => rowData ?
                              rowData.price === '' ? rowData.price : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(rowData.price)
                              : '' ,
       validate: rowData => ( typeof rowData.price != 'undefined'?
                                  rowData.price.length <= 0 ?
                                      { isValid: false, helperText: 'Precio es requerido' } : true
                                  : false),
       editComponent: props => {
            return (
              <FormControl>
              <Select
                 value={props.value}
                 placeholder={props.rowData ? props.rowData.price ? `${props.rowData.price}` : `----` : `----`}
                 onChange={e => {
                   props.onChange(e.target.value);
                   var data = { ...props.rowData };
                       data.price = e.target.value.price
                       data.materialPrice = e.target.value
                       props.onRowDataChange(data);

                 }}
                 defaultValue= {props.rowData.materialPrice ? props.rowData.materialPrice : { price: ""} }
                 renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                       {value.special &&
                                           <SpecialPriceIcon color='secondary' fontSize="small" />
                                         }
                                        {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                       </MenuItem>}
                 disabled={!props.rowData.prices || props.rowData.prices.length === 0}

               >
                 {props.rowData && props.rowData.prices && props.rowData.prices.map((matPrice) =>
                   <MenuItem value={matPrice}>
                      {matPrice.special &&
                          <SpecialPriceIcon color='secondary' fontSize="small" />
                        }
                     {matPrice.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(matPrice.price)}
                   </MenuItem>
                 )}
               </Select>
              </FormControl>
            )
          },
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}},
     { title: 'Precio Total', field: 'totalPrice', type: 'currency', editable: 'never', width: '15%', align: 'right',
       render: rowData => typeof rowData != 'undefined' && new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(rowData.amount * (rowData.wastePct/100+1) * rowData.price),
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}}

   ]), [units, options])

  return(
    <Fragment>
        <DetailsTb title='Material' label='material' color='#26a69a' getColumns={getColumns}
         url={`${url}/mtlcosts`} refreshRow={refreshRow}/>
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

export default React.memo(MaterialCostTb, (prev, next) => prev.total == next.total)

const TotalTableRow = withStyles((theme) => ({
  root: {
      borderTop: `solid 2px #26a69a`,
      borderBottom: `none`,

  },
}))(TableRow);

const PlainTableCell = withStyles((theme) => ({
  root: {
    borderBottom: `none`,
  },
}))(TableCell);

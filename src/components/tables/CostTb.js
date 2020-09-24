import React, {Fragment, useRef, useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';

import SpeedDial from './partials/SpeedDial'
import DetailTb from './DetailsTb'
import HeaderTb from './HeaderTb';

import {FormControl, Select, MenuItem, TextField, ListItemIcon, Divider, CircularProgress,
        Button, Grid} from '@material-ui/core'
import {Table, TableBody, TableRow, TableCell} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete'

import MaterialIcon from '@material-ui/icons/LocalMallRounded'
import ManoObraIcon from '@material-ui/icons/PanToolRounded'
import IndirectIcon from '@material-ui/icons/AllOutRounded'
import CheckIcon from '@material-ui/icons/Check';
import EditAttributesIcon from '@material-ui/icons/EditAttributesRounded';
import SpecialPriceIcon from '@material-ui/icons/StarRateRounded';

import api from '../../api'

const materialData = {"97":"Arena","146":"Block","123":"Cemento ","147":"crestuco","142":"Hierro ","149":"material normal","99":"Piedrin","106":"TieWire"}

const useStyles = makeStyles({
  tableTotal: {
    maxWidth: 600,
    marginLeft: 'auto',
    // float: 'right',
  },
  denseItem:{
    paddingTop: 0,
    paddingBottom: 0,
  },
});
const CostTb = (props) => {
  const classes = useStyles()
  const materialRef = useRef(null)
  const workforceRef = useRef(null)
  const indirectRef = useRef(null)

 const [priceList, setPriceList] = useState([])
 const [inputValue, setInputValue] = React.useState('');
 const [options, setOptions] = useState([])

 const loading = options.length === 0;

 useEffect(() => {
   if (!loading) {
     return undefined;
   }
   api.get('materials')
   .then(response => {
     setOptions(response.data)
   })
   .catch(err => {

   })
 }, [])

const refreshRow = () => {
  api.get(`budgets/${props.rowData.budget.id}/rows/${props.rowData.id}`)
  .then(res => {
    const dataUpdate = [...props.rowsData]
    const index = props.rowData.tableData.id
    const updatedRow = {...res.data, tableData: props.rowData.tableData}
    dataUpdate[index] = updatedRow
    props.setRowsData([...dataUpdate])
    console.log('ACTUALIZA ROW AQUI');

    props.setReload(prev => !prev)
  })
  .catch(err => console.log(err))


}


  const actions = [
    { icon: <MaterialIcon />, name: 'Material', onClick: () => materialRef.current.setState({ showAddRow: true }) },
    { icon: <ManoObraIcon />, name: 'Mano de Obra', onClick: () => workforceRef.current.setState({ showAddRow: true }) },
    { icon: <IndirectIcon />, name: 'Costo Indirecto', onClick: () => indirectRef.current.setState({ showAddRow: true }) },


  ];


  const columnsMaterials =    [
     { title: 'Id', field: 'id', hidden: true},
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
     render: rowData => rowData.amount * (rowData.wastePct/100+1), width: '15%', align: 'right',
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
     { title: 'Unidad', field: 'unit.id', lookup: props.units, editable: 'never', width: '15%', align: 'right',
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

   ]


   const columnsCosts =    [
      { title: 'Id', field: 'id', hidden: true},
      { title: 'Mano de Obra', field: 'name', width: '40%',
        validate: rowData => ( typeof rowData.name != 'undefined'?
                                   rowData.name.trim() === '' ?
                                       { isValid: false, helperText: 'Nombre es requerido' } : true
                                   : false)},
      { title: 'Cantidad', field: 'amount', type: 'numeric', initialEditValue: props.rowData.unitAmount,
        validate: rowData => ( typeof rowData.amount != 'undefined'?
                                   rowData.amount.length <= 0 ?
                                       { isValid: false, helperText: 'Cantidad es requerido' } : true
                                   : false),
        render: rowData => rowData.amount, width: '15%', align: 'right'},
      { title: 'Unidad', field: 'unit.id', lookup: props.units,
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

    ]

    const columnsIndirect =    [
       { title: 'Id', field: 'id', hidden: true},
       { title: 'Costos Indirectos', field: 'name', width: '40%',
         validate: rowData => ( typeof rowData.name != 'undefined'?
                                    rowData.name.trim() === '' ?
                                        { isValid: false, helperText: 'Nombre es requerido' } : true
                                    : false)},
       { title: 'Cantidad', field: 'amount', type: 'numeric', render: rowData => rowData.amount, width: '15%', align: 'right',
         validate: rowData => ( typeof rowData.amount != 'undefined'?
                                    rowData.amount.length <= 0 ?
                                        { isValid: false, helperText: 'Cantidad es requerido' } : true
                                    : false)},
       { title: 'Unidad', field: 'unit.id', lookup: props.units, width: '15%', align: 'right',
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

     ]
     console.log(props.rowData);
    return (
      <Fragment>
        <DetailTb onChangeHandler={refreshRow} tableRef={materialRef} url={`${props.url}/mtlcosts`} columns={columnsMaterials} title='Material' label='costo' header={false} color='#26a69a'/>
        <Table  aria-label="spanning table" className={classes.tableTotal}>
            <TableBody>
                <TableRow>
                   <TableCell rowSpan={1} />
                   <TableCell colSpan={2}>Total de Materiales</TableCell>
                   <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(props.rowData.materialCost ? props.rowData.materialCost : 0)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <br />

        <DetailTb onChangeHandler={refreshRow} tableRef={workforceRef} url={`${props.url}/wfcosts`} columns={columnsCosts} title='Mano de Obra' label='costo' header={false} color='#2e73ab'/>
        <Table  aria-label="spanning table" className={classes.tableTotal}>
            <TableBody>
                <TableRow>
                   <TableCell rowSpan={1} />
                   <TableCell colSpan={2}>Total Mano de Obra</TableCell>
                   <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(props.rowData.workForceCost ? props.rowData.workForceCost : 0)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <br />



        <DetailTb onChangeHandler={refreshRow} tableRef={indirectRef} url={`${props.url}/indcosts`} columns={columnsIndirect} title='Costo Indirecto' label='costo' header={false} color='#9ca9a8'/>

         <Table  aria-label="spanning table" className={classes.tableTotal}>
             <TableBody>
                  <TableRow>
                      <TableCell rowSpan={3} />
                     <TableCell colSpan={2}>Total Costos Indirectos</TableCell>
                     <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(props.rowData.indirectCost ? props.rowData.indirectCost : 0)}</TableCell>
                   </TableRow>
                   <TableRow>
                      <TableCell colSpan={2}>Total Costos Directos</TableCell>
                      <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(props.rowData.directCost ? props.rowData.directCost : 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                       <TableCell colSpan={2}>Total Costos del Renglon</TableCell>
                       <TableCell align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(props.rowData.totalCost ? props.rowData.totalCost : 0)}</TableCell>
                     </TableRow>
             </TableBody>
         </Table>


      </Fragment>


    )
}

export default React.memo(CostTb, (prev, next) => {
  console.log(prev.idRow, next.idRow);
  return prev.idRow === next.idRow
})

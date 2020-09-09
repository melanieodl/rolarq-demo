import React, {Fragment, useState, useEffect} from 'react'
import UpdateForm from './UpdateForm'
import api from '../../../api'

import { Button, Grid, InputAdornment} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import {VolumeFields} from '../inputFields'
import ConcretoProp from '../fields/ConcretoPropUpdate'


import * as Yup from 'yup';



const validationSchema = Yup.object().shape({
      name: Yup.string()
        .required('Requerido'),
      area: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
      height: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
       separacion: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
       propTension: Yup.number()
          .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
          .required('Requerido'),
       mixProp: Yup.mixed()
       .required('Requerido'),
    })


    export default function LosaPlanaUpdate(props){

      const [losa, setLosa] = useState({})

      useEffect(() => {
        api.get(`budgets/${props.budgetId}/losasplanas/${props.rowId}`)
        .then(res => setLosa(res.data))
        .catch(err => console.log(err))
      }, [props.open])

      const FormFields = ({values, setFieldValue, errors, touched}) => {
        return (
                <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Field
                       component={TextField}
                       name="name"
                       type="text"
                       label="Nombre"
                       autoFocus
                     />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="area"
                     type="number"
                     label="Area"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                           {"\u33A1"}
                         </InputAdornment>
                       ),
                     }}
                   />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="height"
                     type="number"
                     label="Peralte"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                          m
                         </InputAdornment>
                       ),
                     }}
                   />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="separacion"
                     type="number"
                     label="Separacion"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                           m
                         </InputAdornment>
                       ),
                     }}
                   />
                  </Grid>
                  <Grid item xs={6}>
                  <Field
                  component={TextField}
                   name="propTension"
                   type="number"
                   label="Longitud extra en Tensión"
                   inputProps={{
                     min: 0, max: 100,

                   }}
                   InputProps={{
                     endAdornment: (
                       <InputAdornment position="end">
                         %
                       </InputAdornment>
                     ),
                   }}
                 />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <ConcretoProp errors={errors} touched={touched} value={losa.mixProp}/>
                  </Grid>

                </Grid>

                </Fragment>
        )
      }

      return(
        <UpdateForm title='Losa Plana' url='losasplanas' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
        rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
        actualData={losa} form={FormFields}  validationSchema={validationSchema}
        open={props.open} closeModal={props.closeModal}
        />
      )
    }

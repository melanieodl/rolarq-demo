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
      amount: Yup.number()
        .positive('Deber ser positivo')
        .integer('Cantidad deber ser un número entero ')
        .required('Requerido'),
      length: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
      width: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
      height: Yup.number()
       .positive('Deber ser positivo')
       .required('Requerido'),
       recubrimiento: Yup.number()
         .positive('Deber ser positivo')
         .required('Requerido'),
       cantLongsElems: Yup.number()
          .positive('Deber ser positivo')
          .integer('Deber ser un número entero ')
          .required('Requerido'),
       separacion: Yup.number()
          .positive('Deber ser positivo')
          .required('Requerido'),
       longHook: Yup.number()
           .positive('Deber ser positivo')
           .required('Requerido'),
       mixProp: Yup.mixed()
           .required('Requerido'),
    })


    export default function ColumnaUpdate(props){

      const [columna, setColumna] = useState({})

      useEffect(() => {
        api.get(`budgets/${props.budgetId}/columnas/${props.rowId}`)
        .then(res => setColumna(res.data))
        .catch(err => console.log(err))
      }, [props.open])

      const FormFields = ({values, setFieldValue, errors, touched}) => {
        return (
                <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                     <Field
                       component={TextField}
                       name="name"
                       type="text"
                       label="Nombre"
                       autoFocus
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <Field
                       component={TextField}
                       name="amount"
                       type="number"
                       label="Cantidad"
                     />
                  </Grid>
                </Grid>

                <VolumeFields errors={errors} touched={touched} heightLabel="Peralte"/>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                   <Field
                   component={TextField}
                    name="recubrimiento"
                    type="number"
                    label="Recubrimiento"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          mts
                        </InputAdornment>
                      ),
                    }}
                  />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="cantLongsElems"
                     type="number"
                     label="Cantidad elementos longitudinales"
                   />
                  </Grid>

                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="separacion"
                     type="number"
                     label={`Separacion ${props.elementos}`}
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                          mts
                         </InputAdornment>
                       ),
                     }}
                   />

                  </Grid>
                  <Grid item xs={6}>
                    <Field
                    component={TextField}
                     name="longHook"
                     type="number"
                     label="Largo Gancho"
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position="end">
                          mts
                         </InputAdornment>
                       ),
                     }}
                   />

                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <ConcretoProp errors={errors} touched={touched} value={columna.mixProp}/>
                  </Grid>

                </Grid>

                </Fragment>
        )
      }

      return(
        <UpdateForm title='Columna' url='columnas' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
        rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
        actualData={columna} form={FormFields}  validationSchema={validationSchema}
        open={props.open} closeModal={props.closeModal}
        />
      )
    }

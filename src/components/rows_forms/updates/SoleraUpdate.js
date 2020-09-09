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


    export default function SoleraUpdate(props){

      const [solera, setSolera] = useState({})

      useEffect(() => {
        api.get(`budgets/${props.budgetId}/soleras/${props.rowId}`)
        .then(res => setSolera(res.data))
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
                      <ConcretoProp errors={errors} touched={touched} value={solera.mixProp}/>
                  </Grid>

                </Grid>

                </Fragment>
        )
      }

      return(
        <UpdateForm title='Solera' url='soleras' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
        rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
        actualData={solera} form={FormFields}  validationSchema={validationSchema}
        open={props.open} closeModal={props.closeModal}
        />
      )
    }

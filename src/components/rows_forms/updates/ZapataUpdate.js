import React, {Fragment, useState, useEffect} from 'react'
import UpdateForm from './UpdateForm'
import api from '../../../api'

import { Button, Grid, InputAdornment, CircularProgress} from '@material-ui/core'
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
       cantTransElems: Yup.number()
         .positive('Deber ser positivo')
         .integer('Deber ser un número entero ')
         .required('Requerido'),
       mixProp: Yup.mixed()
       .required('Requerido'),
    })


    export default function ZapataPlanaUpdate(props){

      const [zapata, setZapata] = useState(null)
      const [isLoading, setLoading] = useState(true)

      useEffect(() => {
        api.get(`budgets/${props.budgetId}/zapatas/${props.rowId}`)
        .then(res => {
          setZapata(res.data)
          setLoading(false)
        })
        .catch(err => console.log(err))
      }, [props.open])

      const FormFields = ({values, setFieldValue, errors, touched}) => {
        return isLoading ?
                <div style={{display: 'table-cell', width: '100%', height: '100%',
                              verticalAlign:'middle', textAlign:'center'}}>
                <CircularProgress/>
                </div>
                :
              (
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
                  <VolumeFields errors={errors} touched={touched}  heightLabel='Peralte'/>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
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

                    <Grid item xs={4}>
                      <Field
                      component={TextField}
                       name="cantLongsElems"
                       type="number"
                       label="Cantidad elementos longitudinales"
                     />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                      component={TextField}
                       name="cantTransElems"
                       type="number"
                       label="Cantidad elementos transversales"
                     />
                    </Grid>

                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ConcretoProp errors={errors} touched={touched} value={zapata.mixProp}/>
                    </Grid>
                  </Grid>
              </Fragment>

        )

      }

      return(

          <UpdateForm title='Zapata' url='zapatas' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
          rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
          actualData={zapata} form={FormFields}  validationSchema={validationSchema}
          open={props.open} closeModal={props.closeModal}
          />


      )
    }

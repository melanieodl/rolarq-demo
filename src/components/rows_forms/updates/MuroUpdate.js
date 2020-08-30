import React, {Fragment, useState, useEffect} from 'react'
import UpdateForm from './UpdateForm'
import api from '../../../api'

import { Button, Grid, InputAdornment} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import MorteroProp from '../fields/MorteroPropUpdate'

import * as Yup from 'yup';



const validationSchema = Yup.object().shape({
        name: Yup.string()
          .required('Requerido'),
        area: Yup.number()
         .positive('Deber ser positivo')
         .required('Requerido'),
        junta: Yup.number()
         .positive('Deber ser positivo')
         .required('Requerido'),
       mixProp: Yup.mixed()
        .required('Requerido'),
    })

export default function IronSpecsForm(props){

  const [muro, setMuro] = useState({})

  useEffect(() => {
    api.get(`budgets/${props.budgetId}/muros/${props.rowId}`)
    .then(res => setMuro(res.data))
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
                   name="junta"
                   type="number"
                   label="Junta"
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
              <Grid item xs={12}>
                  <MorteroProp errors={errors} touched={touched} value={muro.mixProp}/>
              </Grid>

            </Grid>

            </Fragment>
    )
  }

  return(
    <UpdateForm title='Muro' url='muros' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
    rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
    actualData={muro} form={FormFields}  validationSchema={validationSchema}
    open={props.open} closeModal={props.closeModal}
    />
  )
}

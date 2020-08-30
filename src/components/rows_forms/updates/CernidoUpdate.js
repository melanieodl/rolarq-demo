import React, {Fragment, useState, useEffect} from 'react'
import UpdateForm from './UpdateForm'
import api from '../../../api'

import { Button, Grid, InputAdornment} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

const FormFields = ({values, setFieldValue}) => {
  return (
    <Fragment>
    <Grid container spacing={3}>
        <Grid item xs={9}>
             <Field
               component={TextField}
               name="name"
               type="text"
               label="Nombre"
               autoFocus
             />
        </Grid>
        <Grid item xs={3}>
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
    </Grid>
    </Fragment>
  )
}

const validationSchema = Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
               area: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
       })

export default function IronSpecsForm(props){

  const [cernido, setCernido] = useState({})

  useEffect(() => {
    api.get(`budgets/${props.budgetId}/cernidos/${props.rowId}`)
    .then(res => setCernido(res.data))
    .catch(err => console.log(err))
  }, [props.open])

  return(
    <UpdateForm title='Cernido' url='cernidos' rowUrl={`budgets/${props.budgetId}/rows/${props.rowId}`}
    rowId={props.rowId} budgetId={props.budgetId} rowData={props.rowData} rowsData={props.rowsData} setRowsData={props.setRowsData}
    actualData={cernido} form={FormFields}  validationSchema={validationSchema}
    open={props.open} closeModal={props.closeModal}
    />
  )
}

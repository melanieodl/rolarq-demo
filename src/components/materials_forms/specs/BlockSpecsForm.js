import React, {Fragment} from 'react'
import SpecsForm from './Specs'

import { Button, Grid} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

const FormFields = ({values, setFieldValue}) => {
  return (
      <Fragment>
            <Grid item xs={3}>
               <Field
                 component={TextField}
                 name={`length`}
                 type="number"
                 label="Largo"
               />
            </Grid>
            <Grid item xs={3}>
               <Field
                 component={TextField}
                 name={`width`}
                 type="number"
                 label="Ancho"
               />
            </Grid>
            <Grid item xs={3}>
               <Field
                 component={TextField}
                 name={`height`}
                 type="number"
                 label="Alto"
               />
            </Grid>
            <Grid item xs={1} />
        </Fragment>




  )
}


const validationSchema = Yup.object().shape({
   length: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
   width: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
   height: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
 });

export default function IronSpecsForm(props){
  return(
    <SpecsForm url='blocks' id={props.id} specs={props.specs} form={FormFields}
    materialUrl={props.url}     materialData={props.materialData}
    tableData={props.tableData} materialsData={props.materialsData} setMaterialsData={props.setMaterialsData}
    validationSchema={validationSchema}
    />
  )
}

import React, {Fragment} from 'react'
import SpecsForm from './Specs'

import { Button, Grid} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import * as Yup from 'yup'
const FormUpdate = () => {
  return (
      <Fragment>
            <Grid item xs={5}>
               <Field
                 component={TextField}
                 name={`length`}
                 type="number"
                 label="Longitud"
               />
            </Grid>
            <Grid item xs={5}>
               <Field
                 component={TextField}
                 name={`diameter`}
                 type="number"
                 label="Diametro"
               />
            </Grid>
        </Fragment>
  )
}

const validationSchema = Yup.object().shape({
   length: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
    diameter: Yup.number()
     .positive('Deber ser positivo')
     .required('Requerido'),
 });

export default function IronSpecsForm(props){
  return(
    <SpecsForm url='irons' id={props.id} specs={props.specs} form={FormUpdate} materialUrl={props.url}
    materialData={props.materialData}
    tableData={props.tableData} materialsData={props.materialsData} setMaterialsData={props.setMaterialsData}
    validationSchema={validationSchema}
    />
  )
}

import React, {Fragment} from 'react'
import SpecsForm from './Specs'

import { Button, Grid} from '@material-ui/core'
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup'
const FormFields = () => {
  return (
      <Fragment>

            <Grid item xs={10}>
               <Field
                 component={TextField}
                 name={`knotsPerPound`}
                 type="number"
                 label="Nudos por Libra"
               />
            </Grid>
        </Fragment>
  )
}

const validationSchema = Yup.object().shape({
   knotsPerPound: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
 });

export default function IronSpecsForm(props){
  return(
    <SpecsForm url='tiewires' id={props.id} specs={props.specs} form={FormFields}
    materialUrl={props.url}     materialData={props.materialData}
    tableData={props.tableData} materialsData={props.materialsData} setMaterialsData={props.setMaterialsData}
    validationSchema={validationSchema}
    />
  )
}

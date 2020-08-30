import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';

export default function VolumeFields(props){

  return(
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Field
        component={TextField}
         name="length"
         type="number"
         label={props.lengthLabel ? props.lengthLabel : "Largo"}
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
         name="width"
         type="number"
         label="Ancho"
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
         name="height"
         type="number"
         label={props.heightLabel ? props.heightLabel : "Alto"}
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
  )
}

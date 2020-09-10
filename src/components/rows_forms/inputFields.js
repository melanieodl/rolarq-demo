import React, {Fragment} from 'react'
import { TextField, InputLabel, FormControl, Select, InputAdornment,
         Typography, FormControlLabel, Grid} from "@material-ui/core";
import { CheckboxWithLabel, Switch } from 'formik-material-ui';

import Volume from './info/Volume'
import { Field } from "formik";

const NameField = ({name, label, value, setFieldValue, errors, touched}) => {
  return (
    <Fragment>
    <Field
      component={TextField}
      name={name ? name : "name"}
      type="text"
      label={label ? label : "Nombre"}
      autoFocus
      value={value}
      onChange={e => setFieldValue(name ? name : 'name', e.target.value)}
    />
    {errors["name"] && touched["name"] ? (
      <div><Typography color='error' variant='caption'>{errors["name"]}</Typography></div>
    ) : null}
    </Fragment>
  )
}

const LinearMeterField = ({name, label, value, setFieldValue, errors, touched}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         name={name}
         type="number"
         label={label}
         value={value}
         onChange={e => setFieldValue(name, e.target.value)}
         inputProps={{
           step: "0.001"
         }}
         InputProps={{
           endAdornment: (
             <InputAdornment position="end">
               m
             </InputAdornment>
           ),
         }}
       />
       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const QuantityField = ({name, label, value, setFieldValue, errors, touched}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         name={name}
         type="number"
         label={label}
         value={value}
         inputProps={{
           step: "1"
         }}
         onChange={e => setFieldValue(name, e.target.value)}
       />
       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const SquareMeterField = ({name, label, value, setFieldValue, errors, touched}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         name={name}
         type="number"
         label={label}
         value={value}
         onChange={e => setFieldValue(name, e.target.value)}
         inputProps={{
           step: "0.001"
         }}
         InputProps={{
           endAdornment: (
             <InputAdornment position="end">
             {"\u33A1"}
             </InputAdornment>
           ),
         }}
       />
       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const PercentageField = ({name, label, value, setFieldValue, errors, touched}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         name={name}
         type="number"
         label={label}
         value={value}
         onChange={e => setFieldValue(name, e.target.value)}
         inputProps={{
           min: 0, max: 100,
           step: "1"
         }}
         InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                %
              </InputAdornment>
            ),
         }}
      />
      {errors[name] && touched[name] ? (
        <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
      ) : null}
    </Fragment>
  )
}

const BooleanCheckField = ({name, label, value, setFieldValue, errors, touched}) => (
  <Field
    component={CheckboxWithLabel}
    type="checkbox"
    value={value}
    indeterminate= {false}
    onChange={e => setFieldValue(name, e.target.value)}
    InputProps={{
      // indeterminate: true
    }}
    name={name}
    Label={{ label: `${label}` }}
  />
)

const BooleanField = ({name, label, value, setFieldValue, errors, touched}) => (

  <FormControlLabel styles={{label: {color: '#0000008a'}}}
       control = {<Field
                     component={Switch}
                     type="checkbox"
                     name={name}
                     value={value}
                     onChange={e => setFieldValue(name, e.target.value)}
                   />}
       label = {label}
     />

)

<<<<<<< HEAD
const VolumeFields = (props) => {

  const MeasureField = ({name, label}) => {
    return(
          <Field
          component={TextField}
           name={name}
           type="number"
           label={label}
           inputProps={{
             step: "0.001"
           }}
           InputProps={{
             endAdornment: (
               <InputAdornment position="end">
                 m
               </InputAdornment>
             ),
           }}
         />

    )
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <MeasureField name="length" label={props.lengthLabel ? props.lengthLabel : "Largo"}/>
        </Grid>
      <Grid item xs={4}>
        <MeasureField name="width" label={props.widthLabel ? props.widthLabel : "Ancho"}/>
        </Grid>
      <Grid item xs={4}>
        <MeasureField name="height" label={props.heightLabel ? props.heightLabel : "Alto"}/>
      </Grid>
    </Grid>
  )
}
=======
const VolumeFields = ({lengthLabel, widthLabel, heightLabel}) => (
  <Volume lengthLabel={lengthLabel} widthLabel={widthLabel} heightLabel={heightLabel}/>
  )
>>>>>>> update_rows


export {NameField, LinearMeterField,
        QuantityField, SquareMeterField, PercentageField, BooleanField, VolumeFields}

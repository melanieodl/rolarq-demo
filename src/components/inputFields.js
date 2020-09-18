import React, {Fragment} from 'react'
import { TextField, InputLabel, FormControl, Select, InputAdornment,
         Typography, FormControlLabel, Grid, FormHelperText} from "@material-ui/core";
import { CheckboxWithLabel, Switch } from 'formik-material-ui';

import Volume from './rows_forms/info/Volume'
import { Field } from "formik";

const NameField = ({name, label, value, setFieldValue, errors, touched, helperText, fieldProps}) => {
  return (
    <Fragment>
    <Field
      component={TextField}
      id={name}
      name={name ? name : "name"}
      type="text"
      label={label ? label : "Nombre"}
      autoFocus
      value={value}
      onChange={e => setFieldValue(name ? name : 'name', e.target.value)}
      InputProps={{
        ...fieldProps
      }}
    />
    {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}

    {errors["name"] && touched["name"] ? (
      <div><Typography color='error' variant='caption'>{errors["name"]}</Typography></div>
    ) : null}
    </Fragment>
  )
}

const LinearMeterField = ({name, label, value, setFieldValue, errors, touched, helperText}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         id={name}
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
       {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}

       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const QuantityField = ({name, label, value, setFieldValue, errors, touched, helperText}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         id={name}
         name={name}
         type="number"
         label={label}
         value={value}
         inputProps={{
           step: "1"
         }}
         onChange={e => setFieldValue(name, e.target.value)}
       />
       {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}
       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const SquareMeterField = ({name, label, value, setFieldValue, errors, touched, helperText}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         id={name}
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
       {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}
       {errors[name] && touched[name] ? (
         <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
       ) : null}
    </Fragment>
  )
}

const PercentageField = ({name, label, value, setFieldValue, errors, touched, helperText}) => {
  return(
    <Fragment>
        <Field
        component={TextField}
         id={name}
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
      {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}
      {errors[name] && touched[name] ? (
        <div><Typography color='error' variant='caption'>{errors[name]}</Typography></div>
      ) : null}
    </Fragment>
  )
}

const BooleanCheckField = ({name, label, value, setFieldValue, errors, touched, helperText}) => (
    <Fragment>
      <Field
        id={name}
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
      {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}
    </Fragment>
)

const BooleanField = ({name, label, value, setFieldValue, errors, touched, helperText}) => (
  <Fragment>
  <FormControlLabel styles={{label: {color: '#0000008a'}}}
       control = {<Field
                     component={Switch}
                     type="checkbox"
                     id={name}
                     name={name}
                     value={value}
                     onChange={e => setFieldValue(name, e.target.value)}
                   />}
       label = {label}

     />
     {helperText && <FormHelperText id={`${name}-helper-text`}>{helperText}</FormHelperText>}
    </Fragment>

)

const VolumeFields = ({lengthLabel, widthLabel, heightLabel}) => (
  <Volume lengthLabel={lengthLabel} widthLabel={widthLabel} heightLabel={heightLabel}/>
  )


export {NameField, LinearMeterField,
        QuantityField, SquareMeterField, PercentageField, BooleanField, VolumeFields}

import React, {useState, useEffect} from 'react'
import { Grid, TextField, Typography } from "@material-ui/core";
import { Field } from "formik";
import {MenuItem, InputLabel, FormControl} from '@material-ui/core'
import { Select } from 'formik-material-ui';

import api from '../../../api'

export default function ConcretoProp(props){
  const [mixProps, setMixProps] = useState([])

  useEffect(() => {

    api.get('concretos')
    .then(response => {

      setMixProps(response.data)


    })
    .catch(err => {

    })
  }, [])
  return(
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <FormControl>
          <InputLabel htmlFor="mix-prop">Proporción volumétrica (Concreto)</InputLabel>
          <Field
            component={Select}
            disabled={mixProps.length === 0}
            name="mixProp"
            defaultValue= {props.value ? props.value : {propCement: "", propSand: "", propGravel: ""} }
            displayEmpty
            renderValue={value => <MenuItem value={value}>{`${value.propCement} cemento  -  ${value.propSand} arena - ${value.propGravel} piedrín : \u338F/\u33A0 ${value.kgPerSqrCm}`}</MenuItem>}
            inputProps={{
              id: 'mix-prop',
            }}
          >
            {mixProps.map(prop => <MenuItem value={prop}>{`${prop.propCement} cemento  -  ${prop.propSand} arena  - ${prop.propGravel} piedrín : \u338F/\u33A0 ${prop.kgPerSqrCm}`}</MenuItem>)}
          </Field>

        </FormControl>
      </Grid>
    </Grid>
  )
}

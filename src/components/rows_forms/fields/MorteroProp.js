import React, {useState, useEffect} from 'react'
import { Grid, TextField, Typography } from "@material-ui/core";
import { Field } from "formik";
import {MenuItem, InputLabel, FormControl} from '@material-ui/core'
import { Select } from 'formik-material-ui';

import api from '../../../api'

export default function MorteroProp(props){
  const [mixProps, setMixProps] = useState([])

  useEffect(() => {

    api.get('morteros')
    .then(response => {

      setMixProps(response.data)
      console.log(props.value);


    })
    .catch(err => {

    })
  }, [])
  return(
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <FormControl>
          <InputLabel htmlFor="mix-prop">Proporción volumétrica (Mortero)</InputLabel>
          <Field
            component={Select}
            disabled={mixProps.length === 0}
            name="mixProp"
            defaultValue= {props.values.mixProp ? props.values.mixProp : null }
            displayEmpty
            renderValue={value => value ? <MenuItem value={value}>{`${value.propCement} cemento  -  ${value.propSand} arena - ${value.propGravel} piedrín : \u338F/\u33A0 ${value.kgPerSqrCm}`}</MenuItem> : ''}

            inputProps={{
              id: 'mix-prop',

            }}
          >

            {mixProps.map(prop => <MenuItem value={prop}>{`${prop.propCement} cemento  -  ${prop.propSand} arena`}</MenuItem>)}
          </Field>

        </FormControl>
      </Grid>
    </Grid>
  )
}

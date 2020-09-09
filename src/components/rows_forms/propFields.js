import React, {useState, useEffect} from 'react'
import { Grid, TextField, Typography } from "@material-ui/core";
import { Field } from "formik";
import {MenuItem, InputLabel, FormControl} from '@material-ui/core'
import { Select } from 'formik-material-ui';
import api from '../../api'

const PropField = ({url, propName, value, renderValue,
                    errors, touched}) => {
  const [mixProps, setMixProps] = useState([])

  useEffect(() => {
    api.get(url)
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
          <InputLabel htmlFor="mix-prop">{`Proporción volumétrica (${propName})`}</InputLabel>
          <Field
            component={Select}
            disabled={mixProps.length === 0}
            name="mixProp"
            defaultValue= {value ? value : null }
            displayEmpty
            renderValue={value => value ? <MenuItem value={value}>{renderValue(value)}</MenuItem> : ''}
            inputProps={{
              id: 'mix-prop',

            }}
          >
            {mixProps.map(prop => <MenuItem value={prop}>{renderValue(prop)}</MenuItem>)}
          </Field>
          {errors["mixProp"] && touched["mixProp"] ? (
            <div><Typography color='error' variant='caption'>{errors["mixProp"]}</Typography></div>
          ) : null}

        </FormControl>
      </Grid>
    </Grid>

  )
}

const MorteroProp = ({value, errors, touched}) => (
  <PropField url="morteros" propName="Mortero" value={value}
             renderValue={value => `${value.propCement} cemento  -  ${value.propSand} arena`}
             errors={errors} touched={touched}
             />
)

const ConcretoProp = ({value, errors, touched}) => (
  <PropField url="concretos" propName="Concreto" value={value}
             renderValue={value => `${value.propCement} cemento  -  ${value.propSand} arena - ${value.propGravel} piedrín (${value.kgPerSqrCm} \u338F/\u33A0)`}
             errors={errors} touched={touched}
             />
)



export {MorteroProp, ConcretoProp}

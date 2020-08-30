import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Field } from "formik";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress,Typography,  MenuItem, InputLabel, FormControl,
        InputAdornment} from '@material-ui/core'
import { Select } from 'formik-material-ui';
import SpecialPriceIcon from '@material-ui/icons/StarRateRounded';

import api from '../../../api'

const useStyles = makeStyles({
  denseItem:{
    paddingTop: 0,
    paddingBottom: 0,
  },
});


export default function CementCost(props){

  const classes = useStyles()

  const [cements, setCements] = useState([])
  const loading = cements.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('cements/prices')
    .then(response => {

      setCements(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialCement"
          name="cement"
          options={cements}
          value={props.values.cement}
          loading={loading}
          onChange={(e, value) => {
            props.setFieldValue("cement", value);
            props.setFieldValue("cementPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="cement"
              label="Cemento"
              fullWidth
            />
          )}
        />
        {props.errors.cement && props.touched.cement ? (
          <div><Typography color='error' variant='caption'>{props.errors.cement}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="cement-price">Precio Cemento</InputLabel>
          <Field
            component={Select}
            disabled={!props.values.cement || !props.values.cement.prices|| props.values.cement.prices.length === 0}
            name="cementPrice"
            defaultValue= {props.values.cementPrice ? props.values.cementPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>
                              }
            inputProps={{
              id: 'cement-price',
            }}

          >
    
              {props.values.cement && props.values.cement.prices.map(cementPrice => <MenuItem value={cementPrice}>
                  {cementPrice.special &&
                      <SpecialPriceIcon color='secondary' fontSize="small" />}
                  {cementPrice.price ?
                     new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(cementPrice.price) : ''}

                </MenuItem>)}

          </Field>
          {props.errors.cementPrice && props.touched.cementPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.cementPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="cementWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.cementWastePct}
           onChange={e => props.setFieldValue("cementWastePct", e.target.value)}
           inputProps={{
             min: 0, max: 100,

           }}
           InputProps={{
             endAdornment: (
               <InputAdornment position="end">
                 %
               </InputAdornment>
             ),
           }}
         />
         {props.errors.cementWastePct && props.touched.cementWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.cementWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

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

export default function GravelCost(props){
  const classes = useStyles()
  const [gravels, setGravels] = useState([])
  const loading = gravels.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('gravels/prices')
    .then(response => {

      setGravels(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialGravel"
          name="gravel"
          options={gravels}
          value={props.values.gravel}
          loading={loading}
          onChange={(e, value) => {
            console.log(value);
            props.setFieldValue("gravel", value);
            props.setFieldValue("gravelPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="gravel"
              label="Piedrín"
              fullWidth
            />
          )}
        />
        {props.errors.gravel && props.touched.gravel ? (
          <div><Typography color='error' variant='caption'>{props.errors.gravel}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="gravel-price">Precio Piedrín</InputLabel>
          <Field
            component={Select}
            disabled={!props.values.gravel || !props.values.gravel.prices|| props.values.gravel.prices.length === 0}
            name="gravelPrice"
            defaultValue= {props.values.gravelPrice ? props.values.gravelPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>
                              }
            inputProps={{
              id: 'gravel-price',
            }}
          >
          {props.values.gravel && props.values.gravel.prices.map(gravelPrice => <MenuItem value={gravelPrice}>
              {gravelPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {gravelPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(gravelPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.gravelPrice && props.touched.gravelPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.gravelPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="gravelWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.gravelWastePct}
           onChange={e => props.setFieldValue("gravelWastePct", e.target.value)}
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
         {props.errors.gravelWastePct && props.touched.gravelWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.gravelWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

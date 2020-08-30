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

export default function SandCost(props){
  const classes = useStyles()
  const [sands, setSands] = useState([])
  const loading = sands.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('sands/prices')
    .then(response => {

      setSands(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialSand"
          name="sand"
          options={sands}
          value={props.values.sand}
          loading={loading}
          onChange={(e, value) => {
            console.log(value);
            props.setFieldValue("sand", value);
            props.setFieldValue("sandPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="sand"
              label="Arena"
              fullWidth
            />
          )}
        />
        {props.errors.sand && props.touched.sand ? (
          <div><Typography color='error' variant='caption'>{props.errors.sand}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="sand-price">Precio Arena</InputLabel>
          <Field
            component={Select}
            disabled={!props.values.sand || !props.values.sand.prices|| props.values.sand.prices.length === 0}
            name="sandPrice"
            defaultValue= {props.values.sandPrice ? props.values.sandPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>
                              }
            inputProps={{
              id: 'sand-price',
            }}
          >
          {props.values.sand && props.values.sand.prices.map(sandPrice => <MenuItem value={sandPrice}>
              {sandPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {sandPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(sandPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.sandPrice && props.touched.sandPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.sandPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="sandWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.sandWastePct}
           onChange={e => props.setFieldValue("sandWastePct", e.target.value)}
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
         {props.errors.sandWastePct && props.touched.sandWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.sandWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

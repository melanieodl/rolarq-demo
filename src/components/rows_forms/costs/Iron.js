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


export default function IronCost(props){
  const classes = useStyles()

  const [irons, setIrons] = useState([])
  const loading = irons.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('irons/prices')
    .then(response => {

      setIrons(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialIron"
          name="iron"
          options={irons}
          value={props.values.iron}
          loading={loading}
          onChange={(e, value) => {
            props.setFieldValue("iron", value);
            props.setFieldValue("ironPrice", '')

          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="iron"
              label="Hierro"
              fullWidth
            />
          )}
        />
        {props.errors.iron && props.touched.iron ? (
          <div><Typography color='error' variant='caption'>{props.errors.iron}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="iron-price">Precio hierro</InputLabel>
          <Field
            component={Select}
            name="ironPrice"
            disabled={!props.values.iron || !props.values.iron.prices|| props.values.iron.prices.length === 0}
            defaultValue= {props.values.ironPrice ? props.values.ironPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>}
            inputProps={{
              id: 'iron-price',
            }}
          >
          {props.values.iron && props.values.iron.prices.map(ironPrice => <MenuItem value={ironPrice}>
              {ironPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {ironPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(ironPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.ironPrice && props.touched.ironPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.ironPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="ironWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.ironWastePct}
           onChange={e => props.setFieldValue("ironWastePct", e.target.value)}
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
         {props.errors.ironWastePct && props.touched.ironWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.ironWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

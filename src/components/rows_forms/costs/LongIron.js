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
          name="longIron"
          options={irons}
          value={props.values.longIron}
          loading={loading}
          onChange={(e, value) => {
            console.log('longIron', value);
            props.setFieldValue("longIron", value);
            props.setFieldValue("longIronPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="longIron"
              label="Hierro longitudinal"
              fullWidth
            />
          )}
        />
        {props.errors.longIron && props.touched.longIron ? (
          <div><Typography color='error' variant='caption'>{props.errors.longIron}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="iron-price">Precio hierro longitudinal</InputLabel>
          <Field
            component={Select}
            name="longIronPrice"
            disabled={!props.values.longIron || !props.values.longIron.prices|| props.values.longIron.prices.length === 0}
            defaultValue= {props.values.longIronPrice ? props.values.longIronPrice : { price: ""} }
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
          {props.values.longIron && props.values.longIron.prices.map(longIronPrice => <MenuItem value={longIronPrice}>
              {longIronPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {longIronPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(longIronPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.longIronPrice && props.touched.longIronPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.longIronPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="longIronWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.longIronWastePct}
           onChange={e => props.setFieldValue("longIronWastePct", e.target.value)}
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
         {props.errors.longIronWastePct && props.touched.longIronWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.longIronWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

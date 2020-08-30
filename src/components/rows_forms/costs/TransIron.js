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
export default function TransIronCost(props){
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
          name="transIron"
          options={irons}
          value={props.values.transIron}
          loading={loading}
          onChange={(e, value) => {
            console.log(value);
            props.setFieldValue("transIron", value);
            props.setFieldValue("transIronPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="transIron"
              label="Hierro transversal"
              fullWidth
            />
          )}
        />
        {props.errors.transIron && props.touched.transIron ? (
          <div><Typography color='error' variant='caption'>{props.errors.transIron}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="iron-price">Precio hierro transversal</InputLabel>
          <Field
            component={Select}
            name="transIronPrice"
            disabled={!props.values.transIron || !props.values.transIron.prices|| props.values.transIron.prices.length === 0}
            defaultValue= {props.values.transIronPrice ? props.values.transIronPrice : { price: ""} }
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
          {props.values.transIron && props.values.transIron.prices.map(transIronPrice => <MenuItem value={transIronPrice}>
              {transIronPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {transIronPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(transIronPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.transIronPrice && props.touched.transIronPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.transIronPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="transIronWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.transIronWastePct}
           onChange={e => props.setFieldValue("transIronWastePct", e.target.value)}
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
         {props.errors.transIronWastePct && props.touched.transIronWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.transIronWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

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

export default function PreMixCost(props){
  const classes = useStyles()

  const [premixes, setPremixes] = useState([])
  const [premixesPrices, setPremixesPrices] = useState([])
  const loading = premixes.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('premixes/prices')
    .then(response => {

      setPremixes(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialPreMix"
          name="preMix"
          options={premixes}
          value={props.values.preMix}
          loading={loading}
          onChange={(e, value) => {
            console.log(value);
            props.setFieldValue("preMix", value);
            props.setFieldValue("preMixPrice", '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="preMix"
              label="Recubrimiento Premezclado"
              fullWidth
            />
          )}
        />
        {props.errors.preMix && props.touched.preMix ? (
          <div><Typography color='error' variant='caption'>{props.errors.preMix}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="preMix-price">Precio Recubrimiento</InputLabel>
          <Field
            component={Select}
            name="preMixPrice"
            disabled={!props.values.preMix || !props.values.preMix.prices|| props.values.preMix.prices.length === 0}
            defaultValue= {props.values.preMixPrice ? props.values.preMixPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>}
            inputProps={{
              id: 'preMix-price',
            }}

          >
          {props.values.preMix && props.values.preMix.prices.map(preMixPrice => <MenuItem value={preMixPrice}>
              {preMixPrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {preMixPrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(preMixPrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.preMixPrice && props.touched.preMixPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.preMixPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="preMixWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.preMixWastePct}
           onChange={e => props.setFieldValue("preMixWastePct", e.target.value)}
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
         {props.errors.preMixWastePct && props.touched.preMixWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.preMixWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

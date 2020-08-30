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
export default function TieWireCost(props){
  const classes = useStyles()
  const [tieWires, setTieWires] = useState([])
  const loading = tieWires.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('tiewires/prices')
    .then(response => {

      setTieWires(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialTieWire"
          name="tieWire"
          options={tieWires}
          value={props.values.tieWire}
          loading={loading}
          onChange={(e, value) => {
            console.log(value);
            props.setFieldValue("tieWire", value);
            props.setFieldValue("tieWirePrice", '')

          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="tieWire"
              label="Alambre de amarre"
              fullWidth
            />
          )}
        />
        {props.errors.tieWire && props.touched.tieWire ? (
          <div><Typography color='error' variant='caption'>{props.errors.tieWire}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="tieWire-price">Precio alambre de amarre</InputLabel>
          <Field
            component={Select}
            name="tieWirePrice"
            disabled={!props.values.tieWire || !props.values.tieWire.prices|| props.values.tieWire.prices.length === 0}
            defaultValue= {props.values.tieWirePrice ? props.values.tieWirePrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>}
            inputProps={{
              id: 'tieWire-price',
            }}

          >
          {props.values.tieWire && props.values.tieWire.prices.map(tieWirePrice => <MenuItem value={tieWirePrice}>
              {tieWirePrice.special &&
                  <SpecialPriceIcon color='secondary' fontSize="small" />}
              {tieWirePrice.price ?
                 new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(tieWirePrice.price) : ''}

            </MenuItem>)}
          </Field>
          {props.errors.tieWirePrice && props.touched.tieWirePrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.tieWirePrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="tieWireWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.tieWireWastePct}
           onChange={e => props.setFieldValue("tieWireWastePct", e.target.value)}
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
         {props.errors.tieWireWastePct && props.touched.tieWireWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.tieWireWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

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

export default function BlockCost(props){
  const classes = useStyles()
  const [blocks, setBlocks] = useState([])
  const loading = blocks.length === 0;

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get('blocks/prices')
    .then(response => {

      setBlocks(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id="materialBlock"
          name="block"
          options={blocks}
          value={props.values.block}
          loading={loading}
          onChange={(e, value) => {
            props.setFieldValue("block", value);
            props.setFieldValue("blockPrice", '')

          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name="block"
              label="Block"
              fullWidth
            />
          )}
        />
        {props.errors.block && props.touched.block ? (
          <div><Typography color='error' variant='caption'>{props.errors.block}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor="block-price">Precio Block</InputLabel>
          <Field
            component={Select}
            disabled={!props.values.block || !props.values.block.prices|| props.values.block.prices.length === 0}
            name="blockPrice"
            defaultValue= {props.values.blockPrice ? props.values.blockPrice : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>
                              }
            inputProps={{
              id: 'block-price',
            }}

          >
            {props.values.block && props.values.block.prices.map(blockPrice => <MenuItem value={blockPrice}>
                {blockPrice.special &&
                    <SpecialPriceIcon color='secondary' fontSize="small" />}
                {blockPrice.price ?
                   new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(blockPrice.price) : ''}

              </MenuItem>)}
          </Field>
          {props.errors.blockPrice && props.touched.blockPrice ? (
            <div><Typography color='error' variant='caption'>{props.errors.blockPrice}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name="blockWastePct"
           type="number"
           label="Pct. Desperdicio"
           value={props.values.blockWastePct}
           onChange={e => props.setFieldValue("blockWastePct", e.target.value)}
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
         {props.errors.blockWastePct && props.touched.blockWastePct ? (
           <div><Typography color='error' variant='caption'>{props.errors.blockWastePct}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}

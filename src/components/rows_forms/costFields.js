import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import api from '../../api'


import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Field } from "formik";
import {Typography,  MenuItem, InputLabel, FormControl, InputAdornment} from '@material-ui/core'
import { Select } from 'formik-material-ui';
import SpecialPriceIcon from '@material-ui/icons/StarRateRounded';

const useStyles = makeStyles({
  denseItem:{
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const CostGroup = ({url,
                      materialName, materialLabel,
                      priceName, priceLabel,
                      pctName, pctLabel,
                      values, setFieldValue, errors, touched}) => {

  const classes = useStyles()

  const [materials, setMaterials] = useState([])
  const loading = materials.length === 0;


  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    api.get(`${url}/prices`)
    .then(response => {

      setMaterials(response.data)


    })
    .catch(err => {

    })
  }, [])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <Autocomplete
          id={`material${materialLabel}`}
          name={materialName}
          options={materials}
          value={values[materialName]}
          loading={loading}
          onChange={(e, value) => {
            setFieldValue(materialName, value);
            setFieldValue(priceName, '')
          }}
          getOptionLabel={option => option.name}
          getOptionDisabled={option => option.prices.length <= 0}
          renderInput={params => (
            <TextField
              {...params}
              name={materialName}
              label={materialLabel}
              fullWidth
            />
          )}
        />
        {errors[materialName] && touched[materialName] ? (
          <div><Typography color='error' variant='caption'>{errors[materialName]}</Typography></div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <InputLabel htmlFor={`${materialName}-price`}>{priceLabel}</InputLabel>
          <Field
            component={Select}
            disabled={!values[materialName] || !values[materialName].prices|| values[materialName].prices.length === 0}
            name={priceName}
            defaultValue= {values[priceName] ? values[priceName] : { price: ""} }
            renderValue={value => <MenuItem dense className={classes.denseItem} value={value}>
                                  {value.special &&
                                      <SpecialPriceIcon color='secondary' fontSize="small" />
                                    }
                                   {value.price === "" ? "" : new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(value.price)}
                                  </MenuItem>
                              }
            inputProps={{
              id: `${materialName}-price`,
            }}

          >

              {values[materialName] && values[materialName].prices.map(cementPrice => <MenuItem value={cementPrice}>
                  {cementPrice.special &&
                      <SpecialPriceIcon color='secondary' fontSize="small" />}
                  {cementPrice.price ?
                     new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(cementPrice.price) : ''}

                </MenuItem>)}

          </Field>
          {errors[priceName] && touched[priceName] ? (
            <div><Typography color='error' variant='caption'>{errors[priceName]}</Typography></div>
          ) : null}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
          <Field
          component={TextField}
           name={pctName}
           type="number"
           label={pctLabel}
           value={values[pctName]}
           onChange={e => setFieldValue(pctName, e.target.value)}
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
         {errors[pctName] && touched[pctName] ? (
           <div><Typography color='error' variant='caption'>{errors[pctName]}</Typography></div>
         ) : null}
      </Grid>
    </Grid>

  )

}


const CementCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='cements'
               materialName='cement' materialLabel='Cemento'
               priceName='cementPrice' priceLabel='Precio de Cemento'
               pctName='cementWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const SandCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='sands'
               materialName='sand' materialLabel='Arena'
               priceName='sandPrice' priceLabel='Precio de Arena'
               pctName='sandWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const GravelCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='gravels'
               materialName='gravel' materialLabel='Piedrín'
               priceName='gravelPrice' priceLabel='Precio de Piedrín'
               pctName='gravelWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const IronCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='irons'
               materialName='iron' materialLabel='Hierro'
               priceName='ironPrice' priceLabel='Precio de Hierro'
               pctName='ironWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const LongIronCost = ({label, values, setFieldValue, errors, touched}) => (
  <CostGroup url='irons'
               materialName='longIron' materialLabel={label ? label : 'Hierro Longitudinal'}
               priceName='longIronPrice' priceLabel='Precio de Hierro'
               pctName='longIronWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const LongIronAuxCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='irons'
               materialName='longIronAux' materialLabel='Hierro Longitudinal Auxiliar'
               priceName='longIronAuxPrice' priceLabel='Precio de Hierro'
               pctName='longIronAuxWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const TransIronCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='irons'
               materialName='transIron' materialLabel='Hierro Transversal'
               priceName='transIronPrice' priceLabel='Precio de Hierro'
               pctName='transIronWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const TieWireCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='tiewires'
               materialName='tieWire' materialLabel='Alambre de Amarre'
               priceName='tieWirePrice' priceLabel='Precio de Alambre'
               pctName='tieWireWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const BlockCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='blocks'
               materialName='block' materialLabel='Block'
               priceName='blockPrice' priceLabel='Precio de Block'
               pctName='blockWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)

const PreMixCost = ({values, setFieldValue, errors, touched}) => (
  <CostGroup url='premixes'
               materialName='preMix' materialLabel='Recubrimiento Premezclado'
               priceName='preMixPrice' priceLabel='Precio de Recubrimiento'
               pctName='preMixnWastePct' pctLabel='Pct. de Desperdicio'
               values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
)


export {CementCost, SandCost, GravelCost,
        IronCost, LongIronCost, LongIronAuxCost, TransIronCost,
        TieWireCost, BlockCost, PreMixCost}

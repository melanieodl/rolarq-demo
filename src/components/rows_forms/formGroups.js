import React, {Fragment} from "react";
import * as Yup from 'yup';

import { Grid } from '@material-ui/core'

import {CementCost, SandCost, GravelCost,
        IronCost, LongIronCost, TransIronCost,
        TieWireCost, BlockCost, PreMixCost} from './costFields'
//Costos completos

import {ConcretoProp, MorteroProp} from './propFields'


import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField,
        VolumeFields} from './inputFields'


        //Schemas y form groups

        const concretoGroup = [
            Yup.object().shape({
             mixProp: Yup.mixed()
                 .required('Requerido'),
                 cement: Yup.mixed()
                     .required('Requerido'),
                 cementPrice: Yup.mixed()
                     .required('Requerido'),
                 sand: Yup.mixed()
                    .required('Requerido'),
                 sandPrice: Yup.mixed()
                    .required('Requerido'),
                 gravel: Yup.mixed()
                    .required('Requerido'),
                 gravelPrice: Yup.mixed()
                    .required('Requerido'),
                  cementWastePct: Yup.number()
                     .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                     .required(),
                  sandWastePct: Yup.number()
                     .positive('Debe ser positivo')
                     .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100'),
                   gravelWastePct: Yup.number()
                       .positive('Debe ser positivo')
                       .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100'),

           }),
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
                 <ConcretoProp errors={errors} touched={touched} values={values}/>
                 <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <GravelCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Fragment>)
        ]

        const morteroGroup = [
            Yup.object().shape({
                mixProp: Yup.mixed()
                    .required('Requerido'),
                cement: Yup.mixed()
                    .required('Requerido'),
                cementPrice: Yup.mixed()
                    .required('Requerido'),
                sand: Yup.mixed()
                   .required('Requerido'),
                sandPrice: Yup.mixed()
                   .required('Requerido'),
                cementWastePct: Yup.number()
                  .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                  .required(),
                sandWastePct: Yup.number()
                  .positive('Debe ser positivo')
                  .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100'),

          }),
            ({values, setFieldValue, errors, touched}) => (
                <Fragment>
                  <MorteroProp errors={errors} touched={touched} value={values.mixProp}/>
                  <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                </Fragment>)
        ]

        const frameIronGroup = [
            Yup.object().shape({
            ironPrice: Yup.mixed()
               .required('Requerido'),
            iron: Yup.mixed()
               .required('Requerido'),
            tieWire: Yup.mixed()
               .required('Requerido'),
            tieWirePrice: Yup.mixed()
               .required('Requerido'),
            ironWastePct: Yup.number()
               .positive('Debe ser positivo')
               .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
               .default(0),
            tieWireWastePct: Yup.number()
               .positive('Debe ser positivo')
               .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
               .default(0),
           }),
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
                 <IronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <TieWireCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Fragment>
             )
         ]

        const frameBiIronGroup = [
           Yup.object().shape({
              longIron: Yup.mixed()
                 .required('Requerido'),
              longIronPrice: Yup.mixed()
                 .required('Requerido'),
              transIron: Yup.mixed()
                 .required('Requerido'),
              transIronPrice: Yup.mixed()
                 .required('Requerido'),
              tieWire: Yup.mixed()
                 .required('Requerido'),
              tieWirePrice: Yup.mixed()
                 .required('Requerido'),
              longIronWastePct: Yup.number()
                  .positive('Debe ser positivo')
                  .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                  .default(0),
              transIronWastePct: Yup.number()
                  .positive('Debe ser positivo')
                  .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                  .default(0),
              tieWireWastePct: Yup.number()
                  .positive('Debe ser positivo')
                  .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                  .default(0),
           }),
           ({values, setFieldValue, errors, touched}) => (
             <Fragment>
               <LongIronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               <TransIronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               <TieWireCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Fragment>
           )
        ]

        const areaVolGroup = [
            Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
               area: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
               height: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
            }),
            ({values, setFieldValue, errors, touched}) => (
              <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                      <SquareMeterField name="area" label="Area" value={values.area} setFieldValue={setFieldValue}
                        errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={6}>
                      <LinearMeterField name="height" label="Espesor" value={values.height} setFieldValue={setFieldValue}
                       errors={errors} touched={touched}/>
                  </Grid>
                </Grid>
              </Fragment>
            )
        ]

        const transMeterGroup = [
            Yup.object().shape({
           name: Yup.string()
             .required('Requerido'),
           length: Yup.number()
            .positive('Deber ser positivo')
            .required('Requerido'),
           width: Yup.number()
            .positive('Deber ser positivo')
            .required('Requerido'),
           height: Yup.number()
            .positive('Deber ser positivo')
            .required('Requerido'),
            recubrimiento: Yup.number()
              .positive('Deber ser positivo')
              .required('Requerido'),
            cantLongsElems: Yup.number()
               .positive('Deber ser positivo')
               .integer('Deber ser un número entero ')
               .required('Requerido'),
            separacion: Yup.number()
               .positive('Deber ser positivo')
               .required('Requerido'),
            longHook: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
           }),
            ({values, setFieldValue,  errors, touched}) => (
             <Fragment>
             <Grid container spacing={3}>
               <Grid item xs={12}>
                  <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
             </Grid>
             <VolumeFields heightLabel="Peralte"/>
             <Grid container spacing={3}>
               <Grid item xs={6}>
                 <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
                 setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={6}>
                 <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                 value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
             </Grid>
             <Grid container spacing={3}>
               <Grid item xs={6}>
                 <LinearMeterField name="separacion" label="Separacion Estribos"
                 value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={6}>
                 <LinearMeterField name="longHook" label="Largo Gancho"
                   value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
             </Grid>
             </Fragment>
           )
        ]

        const transQuantityGroup = [
            Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
               amount: Yup.number()
                 .positive('Deber ser positivo')
                 .integer('Cantidad deber ser un número entero ')
                 .required('Requerido'),
               length: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
               width: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
               height: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
                recubrimiento: Yup.number()
                  .positive('Deber ser positivo')
                  .required('Requerido'),
                cantLongsElems: Yup.number()
                   .positive('Deber ser positivo')
                   .integer('Deber ser un número entero ')
                   .required('Requerido'),
                separacion: Yup.number()
                   .positive('Deber ser positivo')
                   .required('Requerido'),
                longHook: Yup.number()
                    .positive('Deber ser positivo')
                    .required('Requerido'),
                longPata: Yup.number()
                    .positive('Deber ser positivo')
                    .required('Requerido'),
               }),
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
               <Grid container spacing={3}>
                 <Grid item xs={8}>
                    <NameField value={values.name} setFieldValue={setFieldValue}
                    errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={4}>
                    <QuantityField name="amount" label="Cantidad" value={values.amount}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
               </Grid>
               <VolumeFields lengthLabel='Altura' heightLabel='Largo'/>
               <Grid container spacing={3}>
                 <Grid item xs={4}>
                   <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                   value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={4}>
                   <LinearMeterField name="longPata" label="Largo Patas"
                   value={values.longPata} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={4}>
                   <LinearMeterField name="longHook" label="Largo Gancho"
                     value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>

               </Grid>
               <Grid container spacing={3}>
                 <Grid item xs={6}>
                   <LinearMeterField name="separacion" label="Separacion Estribos"
                   value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={6}>
                   <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
                   setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
               </Grid>
               </Fragment>
             )
        ]



export {concretoGroup, morteroGroup, frameIronGroup, frameBiIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup}

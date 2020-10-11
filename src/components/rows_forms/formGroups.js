import React, {Fragment} from "react";
import * as Yup from 'yup';

import { Grid } from '@material-ui/core'

import {CementCost, SandCost, GravelCost,
        IronCost, LongIronCost, LongIronAuxCost, TransIronCost,
        TieWireCost, PreMixCost, BlockCost} from './costFields'

//Costos completos
import {ConcretoProp, MorteroProp} from './propFields'


import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField, BooleanField,
        VolumeFields} from '../inputFields'

import {name, amount, length, width, height, area, profitPct,
        cantLongsElems, cantLongsAuxElems, cantTransElems,
        recubrimiento, separacion, junta,
        longHook, longPata,
        propTension, estribosDouble,
        mixProp,
        cement, cementPrice, cementWastePct,
        sand, sandPrice, sandWastePct,
        gravel, gravelPrice, gravelWastePct,
        iron, ironPrice, ironWastePct,
        longIron, longIronPrice, longIronWastePct,
        longIronAux, longIronAuxPrice, longIronAuxWastePct,
        transIron, transIronPrice, transIronWastePct,
        tieWire, tieWirePrice, tieWireWastePct,
        block, blockPrice, blockWastePct} from '../schemas'

        //Schemas y form groups

        const concretoGroup = [
            { mixProp,
              cement,
              cementPrice,
              cementWastePct,
              sand,
              sandPrice,
              sandWastePct,
              gravel,
              gravelPrice,
              gravelWastePct
            },
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
                 <ConcretoProp errors={errors} touched={touched} values={values}/>
                 <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <GravelCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Fragment>)
        ]

        const morteroGroup = [
            { mixProp,
              cement,
              cementPrice,
              cementWastePct,
              sand,
              sandPrice,
            },
            ({values, setFieldValue, errors, touched}) => (
                <Fragment>
                  <MorteroProp errors={errors} touched={touched} value={values.mixProp}/>
                  <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                </Fragment>)
        ]

        const frameIronGroup = [
            { iron,
              ironPrice,
              ironWastePct,
              tieWire,
              tieWirePrice,
              tieWireWastePct,
            },
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
                 <IronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 <TieWireCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Fragment>
             )
         ]

        const frameBiIronGroup = [
            { longIron,
              longIronPrice,
              longIronWastePct,
              transIron,
              transIronPrice,
              transIronWastePct,
              tieWire,
              tieWirePrice,
              tieWireWastePct,
            },
           ({values, setFieldValue, errors, touched}) => (
             <Fragment>
               <LongIronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               <TransIronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               <TieWireCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Fragment>
           )
        ]

        const frameTriIronGroup = [
            { longIron,
              longIronPrice,
              longIronWastePct,
              longIronAux,
              longIronAuxPrice,
              longIronWastePct,
              transIron,
              transIronPrice,
              transIronWastePct,
              tieWire,
              tieWirePrice,
              tieWireWastePct,
            },
            ({values, setFieldValue, errors, touched}) => (
            <Fragment>
              <LongIronCost label='Hierro Longitudinal Esquinas' values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              <LongIronAuxCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched} />
              <TransIronCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              <TieWireCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
            </Fragment>
          )
        ]

        const areaVolGroup = [
            {name, profitPct, height, area},
            ({values, setFieldValue, errors, touched}) => (
              <Grid container spacing={3}>
                  <Grid item xs={12} sm={9}>
                      <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                     setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <SquareMeterField name="area" label="Area" value={values.area} setFieldValue={setFieldValue}
                        errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <LinearMeterField name="height" label="Espesor" value={values.height} setFieldValue={setFieldValue}
                       errors={errors} touched={touched}/>
                  </Grid>
              </Grid>
            )
        ]

        const transMeterGroup = [
            { name,
              profitPct,
              length,
              width,
              height,
              recubrimiento,
              cantLongsElems,
              separacion,
              longHook},
            ({values, setFieldValue,  errors, touched}) => (
            <Grid container spacing={3}>
               <Grid item xs={12} sm={8}>
                  <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={12} sm={4}>
                 <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                  setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
               </Grid>
               <Grid item xs={12}>
                  <VolumeFields heightLabel="Peralte"/>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
                 setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                 value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <LinearMeterField name="separacion" label="Separacion Estribos"
                 value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <LinearMeterField name="longHook" label="Largo Gancho"
                   value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Grid>
             </Grid>
           )
        ]

        const transQuantityGroup = [
            { name,
              profitPct,
              amount,
              length,
              width,
              height,
              recubrimiento,
              cantLongsElems,
              separacion,
              longHook,
              longPata},
            ({values, setFieldValue, errors, touched}) => (
               <Grid container spacing={3}>
                 <Grid item xs={12} sm={8}>
                    <NameField value={values.name} setFieldValue={setFieldValue}
                    errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={2}>
                    <QuantityField name="amount" label="Cantidad" value={values.amount}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={2}>
                   <PercentageField name="profitPct" label="Pct. Utilidad" value={values.profitPct}
                    setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                 </Grid>
                 <Grid item xs={12}>
                    <VolumeFields lengthLabel='Altura' heightLabel='Largo'/>
                 </Grid>
                 <Grid item xs={12} sm={12} md={4}>
                   <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                   value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6} md={4}>
                   <LinearMeterField name="longPata" label="Largo Patas"
                   value={values.longPata} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6} md={4}>
                   <LinearMeterField name="longHook" label="Largo Gancho"
                     value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <LinearMeterField name="separacion" label="Separacion Estribos"
                   value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
                   setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
               </Grid>
             )
        ]

        const zapataGroup = [
            { name,
              profitPct,
              amount,
              length,
              width,
              height,
              recubrimiento,
              cantLongsElems,
              cantTransElems},
            ({values, setFieldValue, errors, touched}) => (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                 <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={12} sm={2}>
                 <QuantityField name="amount" label="Cantidad" value={values.amount} setFieldValue={setFieldValue}
                 errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={12} sm={2}>
                <PercentageField name="profitPct" label="Pct. Utilidad" value={values.profitPct}
                 setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
              </Grid>
              <Grid item xs={12}>
                <VolumeFields errors={errors} touched={touched} heightLabel='Peralte'/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento} setFieldValue={setFieldValue}
                errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <QuantityField name="cantTransElems" label="Cantidad elementos transversales"
                value={values.cantTransElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
            </Grid>
          )
        ]

        const losaPlanaGroup = [
            { name,
              profitPct,
              area,
              height,
              separacion,
              propTension,},
            ({values, setFieldValue, errors, touched}) => (
              <Grid container spacing={3}>
                 <Grid item xs={12} sm={9}>
                    <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={3}>
                   <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                    setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <SquareMeterField name="area" label="Area" value={values.area} setFieldValue={setFieldValue}
                   errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <LinearMeterField name="height" label="Peralte"
                   value={values.height} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <LinearMeterField name="separacion" label="Separacion" value={values.separacion} setFieldValue={setFieldValue}
                   errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <PercentageField name="propTension" label="Longitud extra en Tensión"
                   value={values.propTension} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
               </Grid>
               )
        ]

        const losaInclinadaGroup = [
            { name,
              profitPct,
              area,
              height,
              separacion},
            ({values, setFieldValue, errors, touched}) => (
              <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                     <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                     setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SquareMeterField name="area" label="Area" value={values.area}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LinearMeterField name="height" label="Peralte"
                    value={values.height} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LinearMeterField name="separacion" label="Separacion" value={values.separacion}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
              </Grid>
              )
        ]

        const muroGroup = [
            { name,
              profitPct,
              area,
              junta,
              block,
              blockPrice,
              blockWastePct
            },
            ({values, setFieldValue, errors, touched}) => (
              <Grid container spacing={3}>
                 <Grid item xs={12} sm={9}>
                   <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={3}>
                   <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                    setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <SquareMeterField name="area" label="Area" value={values.area}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <LinearMeterField name="junta" label="Junta" value={values.junta}
                     setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12}>
                   <BlockCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
             </Grid>
             )
        ]

        const columnaEspecialGroup = [
            {
              name,
              profitPct,
              amount,
              length,
              width,
              height,
              estribosDouble,
              recubrimiento,
              cantLongsElems,
              cantLongsAuxElems,
              separacion,
              longHook,
              longPata
            },
            ({values, setFieldValue, errors, touched}) => (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                   <NameField value={values.name} setFieldValue={setFieldValue}
                   errors={errors} touched={touched}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                   <QuantityField name="amount" label="Cantidad" value={values.amount}
                   setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <PercentageField name="profitPct" label="Pct. Utilidad" value={values.profitPct}
                   setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
                </Grid>
                <Grid item xs={12}>
                <VolumeFields lengthLabel='Altura' heightLabel='Largo'/>
                </Grid>
                 <Grid item xs={12} sm={6}>
                   <QuantityField name="cantLongsElems" label="Cantidad Elementos Esquinas"
                   value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <QuantityField name="cantLongsAuxElems" label="Cantidad Elementos Auxiliares"
                   value={values.cantLongsAuxElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                  <Grid item xs={12} sm={6}>
                    <LinearMeterField name="longPata" label="Largo Patas"
                    value={values.longPata} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LinearMeterField name="longHook" label="Largo Gancho"
                      value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LinearMeterField name="separacion" label="Separacion Estribos"
                    value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <BooleanField name="estribosDouble" label="Estribos dobles"/>
                  </Grid>
                </Grid>
              </Grid>
              )
        ]


export {concretoGroup, morteroGroup, frameIronGroup,
        frameBiIronGroup,frameTriIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup,
        zapataGroup, losaPlanaGroup, losaInclinadaGroup, muroGroup,
        columnaEspecialGroup}

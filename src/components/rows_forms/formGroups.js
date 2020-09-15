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

import {name, amount, length, width, height, area,
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
            {name, height, area},
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
            { name,
              length,
              width,
              height,
              recubrimiento,
              cantLongsElems,
              separacion,
              longHook},
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
            { name,
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

        const zapataGroup = [
            { name,
              amount,
              length,
              width,
              height,
              recubrimiento,
              cantLongsElems,
              cantTransElems},
            ({values, setFieldValue, errors, touched}) => (
            <Fragment>

            <Grid container spacing={3}>
              <Grid item xs={8}>
                 <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={4}>
                 <QuantityField name="amount" label="Cantidad" value={values.amount} setFieldValue={setFieldValue}
                 errors={errors} touched={touched}/>
              </Grid>
            </Grid>

            <VolumeFields errors={errors} touched={touched} heightLabel='Peralte'/>

            <Grid container spacing={3}>
              <Grid item xs={4}>
                <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento} setFieldValue={setFieldValue}
                errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={4}>
                <QuantityField name="cantLongsElems" label="Cantidad elementos longitudinales"
                value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
              <Grid item xs={4}>
                <QuantityField name="cantTransElems" label="Cantidad elementos transversales"
                value={values.cantTransElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              </Grid>
            </Grid>
            </Fragment>
          )
        ]

        const losaPlanaGroup = [
            { name,
              area,
              height,
              separacion,
              propTension,},
            ({values, setFieldValue, errors, touched}) => (
                 <Fragment>
                 <Grid container spacing={3}>
                   <Grid item xs={12}>
                      <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                 </Grid>

                 <Grid container spacing={3}>
                   <Grid item xs={6}>
                     <SquareMeterField name="area" label="Area" value={values.area} setFieldValue={setFieldValue}
                     errors={errors} touched={touched}/>
                   </Grid>
                   <Grid item xs={6}>
                     <LinearMeterField name="height" label="Peralte"
                     value={values.height} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                 </Grid>

                 <Grid container spacing={3}>
                   <Grid item xs={6}>
                     <LinearMeterField name="separacion" label="Separacion" value={values.separacion} setFieldValue={setFieldValue}
                     errors={errors} touched={touched}/>
                   </Grid>
                   <Grid item xs={6}>
                     <PercentageField name="propTension" label="Longitud extra en Tensión"
                     value={values.propTension} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                 </Grid>
                 </Fragment>
               )
        ]

        const losaInclinadaGroup = [
            { name,
              area,
              height,
              separacion},
            ({values, setFieldValue, errors, touched}) => (
                <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <SquareMeterField name="area" label="Area" value={values.area}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={4}>
                    <LinearMeterField name="height" label="Peralte"
                    value={values.height} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={4}>
                    <LinearMeterField name="separacion" label="Separacion" value={values.separacion}
                    setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                </Grid>
                </Fragment>
              )
        ]

        const muroGroup = [
            { name,
              area,
              junta,
              block,
              blockPrice,
              blockWastePct
            },
            ({values, setFieldValue, errors, touched}) => (
               <Fragment>
                 <Grid container spacing={3}>
                   <Grid item xs={12}>
                     <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                 </Grid>
                 <Grid container spacing={3}>
                   <Grid item xs={6}>
                     <SquareMeterField name="area" label="Area" value={values.area}
                      setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                   <Grid item xs={6}>
                     <LinearMeterField name="junta" label="Junta" value={values.junta}
                       setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                   </Grid>
                 </Grid>
                 <BlockCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
               </Fragment>
             )
        ]

        const columnaEspecialGroup = [
            {
              name,
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
                 <Grid item xs={6}>
                   <QuantityField name="cantLongsElems" label="Cantidad Elementos Esquinas"
                   value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                 <Grid item xs={6}>
                   <QuantityField name="cantLongsAuxElems" label="Cantidad Elementos Auxiliares"
                   value={values.cantLongsAuxElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <LinearMeterField name="longPata" label="Largo Patas"
                    value={values.longPata} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                  </Grid>
                  <Grid item xs={6}>
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
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <BooleanField name="estribosDouble" label="Estribos dobles"/>
                  </Grid>
                </Grid>
                </Fragment>
              )
        ]


export {concretoGroup, morteroGroup, frameIronGroup,
        frameBiIronGroup,frameTriIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup,
        zapataGroup, losaPlanaGroup, losaInclinadaGroup, muroGroup,
        columnaEspecialGroup}

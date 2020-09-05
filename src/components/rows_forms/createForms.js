import React, {useState, useEffect, Fragment} from "react";
import api from '../../api'
import * as Yup from 'yup';

import {Stepper, Step, StepLabel, StepContent,
        Grid, TextField, CircularProgress } from '@material-ui/core'
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress,Typography,  MenuItem, InputLabel, FormControl,
        InputAdornment} from '@material-ui/core'

import { Autocomplete } from "@material-ui/lab";
import { Formik, Form, Field } from "formik";
import { Select } from 'formik-material-ui';

import CementCost from './costs/CementCost'
import SandCost from './costs/SandCost'
import GravelCost from './costs/GravelCost'
import Iron from './costs/Iron'
import LongIron from './costs/LongIron'
import TransIron from './costs/TransIron'
import TieWire from './costs/TieWire'
import BlockCost from './costs/BlockCost'

import ConcretoProp from './fields/ConcretoProp'
import MorteroProp from './fields/MorteroProp'

import PreMixCost from './costs/PreMixCost'

import VolumeFields from './fields/Volume'


import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField} from './inputFields'

const specsTransMeterSchema = Yup.object().shape({
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
   })

const SpecsTransMeterFormGroup = ({values, setFieldValue,  errors, touched}) => (
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

const concretoSchema  = Yup.object().shape({
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

 })
const morteroSchema  = Yup.object().shape({
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

})

const ConcretoFormGroup = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <ConcretoProp errors={errors} touched={touched} values={values}/>
      <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
      <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
      <GravelCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    </Fragment>)

const MorteroFormGroup = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <MorteroProp errors={errors} touched={touched} values={values}/>
      <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
      <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    </Fragment>)

const frameBiIronSchema = Yup.object().shape({
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
 })

const FrameBiIronFormGroup = ({values, setFieldValue, errors, touched}) => (
  <Fragment>
    <LongIron values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    <TransIron values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    <TieWire values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
  </Fragment>
)

const frameIronSchema = Yup.object().shape({
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
 })

const FrameIronFormGroup = ({values, setFieldValue, errors, touched}) => (
  <Fragment>
    <Iron values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    <TieWire values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
  </Fragment>
)

const specsTransQuantitySchema = Yup.object().shape({
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
   })
const SpecsTransQuantityFormGroup = ({values, setFieldValue, errors, touched}) => (
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

const areaVolSchema = Yup.object().shape({
   name: Yup.string()
     .required('Requerido'),
   area: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
   height: Yup.number()
    .positive('Deber ser positivo')
    .required('Requerido'),
   })

const AreaVolFormGroup = ({values, setFieldValue, errors, touched}) => (
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

const initials =  {
    name: ``,
    amount: ``,
    length: '',
    width: '',
    height: '',
    area: '',
    recubrimiento: '',
    separacion: '',
    longHook: '',
    longPata: '',
    cantLongsElems: '',
    cantTransElems: '',
    propTension: ''
  }

const concretoInitials = {
      cementWastePct: 0,
      sandWastePct: 0,
      gravelWastePct: 0,
}

const morteroInitials = {
      cementWastePct: 0,
      sandWastePct: 0,
}

const frameBiIronInitials = {
  longIronWastePct: 0,
  transIronWastePct: 0,
  tieWireWastePct: 0,
}

const frameIronInitials = {
  ironWastePct: 0,
  tieWireWastePct: 0,
}



const EmptyForm = props => <Fragment />

const CreateForm = ({getSteps, budgetId, apiId,
                     initialValues,
                     openModal, closeModal,
                     setData, errors, touched, values, setFieldValue}) => {

    const url = `budgets/${budgetId}/${apiId}`

    //stepper state
    const [activeStep, setActiveStep] = React.useState(0);
    const [step, setStep] = useState({label: '', form: EmptyForm , schema: Yup.object().shape({})})
    const steps = getSteps();
    const [serverState, setServerState] = useState();

    useEffect(() => {setStep(steps[0])
                      }, [])

    const isLastStep = () => {
      return activeStep === steps.length - 1;
    }

    const handleNext = () => {
        setStep(steps[activeStep + 1]);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };

    const handleBack = () => {
        setStep(steps[activeStep - 1]);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

      };

    const handleServerResponse = (ok, msg) => {
        setServerState({ok, msg});
      };

    const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
          if (isLastStep()) {
            console.log('values', values);
            api.post(`${url}`, values)
              .then(response => {
                api.get(`${url}/${response.data.id}`)
                .then(res => {
                  const newData = res.data
                  setData(prevData => [newData, ...prevData])

                })
                setSubmitting(false);
                resetForm();
                handleServerResponse(true, "");
                closeModal()
                //agregar a la data general de la tabla materiales
              })
              .catch(error => {
                setSubmitting(false);
                // handleServerResponse(false, error.response.data.);
              });
          } else {
            setSubmitting(false)
            handleNext()
          }

      };


    return (

      <Dialog maxWidth='md' fullWidth open={openModal} onClose={() => closeModal} aria-labelledby="form-dialog-title">
      <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(({label}) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Formik
            initialValues={{...initialValues}}
            validationSchema={step.schema}
            onSubmit={handleOnSubmit}

          >
            {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form autoComplete="off">

              <step.form values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

                {isSubmitting && <LinearProgress />}
                <br />
                <DialogActions>

                    <Button
                     color="inherit"
                     onClick={closeModal}>
                        Cancelar
                     </Button>

                     {activeStep > 0 ? (
                         <Button
                           disabled={isSubmitting}
                           variant="outlined"
                           onClick={handleBack}
                         >
                           Atrás
                         </Button>
                     ) : null}



                 <Button
                   startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                   disabled={isSubmitting}
                   variant="contained"
                   color="primary"
                   type="submit"
                 >
                   {isSubmitting ? 'Enviando' : isLastStep() ? 'Enviar' : 'Siguiente'}
                 </Button>


                </DialogActions>
                {serverState && (
                  <p className={!serverState.ok ? "errorMsg" : ""}>
                    {serverState.msg}
                  </p>
                )}
              </Form>
            )}
          </Formik>
          </DialogContent>

          </Dialog>
    );
}

const SoleraForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Solera',
      schema: specsTransMeterSchema,
      form: SpecsTransMeterFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form: FrameBiIronFormGroup}
  ])

  const {length, width, height, recubrimiento, cantLongsElems, separacion,
    longHook} = initials

  const initialValues = {
    name: `SOLERA `,
    length, width, height, recubrimiento, cantLongsElems, separacion, longHook,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="soleras" initialValues={initialValues}
                setData={setData}
                openModal={openModal} closeModal={closeModal}/>
  )
}

const CimientoForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Cimiento',
      schema: specsTransMeterSchema,
      form: SpecsTransMeterFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form: FrameBiIronFormGroup}
  ])

  const {length, width, height, recubrimiento, cantLongsElems, separacion,
    longHook} = initials

  const initialValues = {
    name: `CIMIENTO CORRIDO `,
    length, width, height, recubrimiento, cantLongsElems, separacion, longHook,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="cimcorridos" initialValues={initialValues}
                setData={setData}
                openModal={openModal} closeModal={closeModal}/>
  )
}

const ColumnaForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Columna',
      schema: specsTransQuantitySchema,
      form: SpecsTransQuantityFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form: FrameBiIronFormGroup}
  ])

  const {amount, length, width, height, recubrimiento,
    cantLongsElems,
    separacion, longPata, longHook} = initials

  const initialValues = {
    name: `COLUMNA `, amount, length, width, height,
    recubrimiento, cantLongsElems, separacion, longHook, longPata,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="columnas" initialValues={initialValues}
                setData={setData}
                openModal={openModal} closeModal={closeModal}/>
  )
}


const ZapataForm = ({budgetId, openModal, closeModal, setData}) => {
  const specsZapataSchema = Yup.object().shape({
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
      cantTransElems: Yup.number()
        .positive('Deber ser positivo')
        .integer('Deber ser un número entero ')
        .required('Requerido'),

     })
  const SpecsZapataFormGroup = ({values, setFieldValue, errors, touched}) => (
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

  const getSteps = () => ([
    { label:'Especificaciones de Zapata',
      schema: specsZapataSchema,
      form: SpecsZapataFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronFormGroup}
  ])

  const {amount, length, width, height, recubrimiento,
    cantLongsElems,  cantTransElems,
    separacion, longPata, longHook} = initials

  const initialValues = {
    name: 'ZAPATA ', amount, length, width, height,
    recubrimiento, cantLongsElems, cantTransElems,
    ...concretoInitials, ...frameIronInitials
  }

  return(
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="zapatas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )

}

const LosaPlanaForm = ({budgetId, openModal, closeModal, setData}) => {
  const losaPlanaSchema = Yup.object().shape({
     name: Yup.string()
       .required('Requerido'),
     area: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     height: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
      separacion: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
      propTension: Yup.number()
         .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
         .required('Requerido'),
     })
  const losaPlanaFormGroup = ({values, setFieldValue, errors, touched}) => (
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
  const getSteps = () => ([
    { label:'Especificaciones de Losa Plana',
      schema: losaPlanaSchema,
      form: losaPlanaFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronFormGroup}
  ])
  const {name, area, height, separacion, propTension} = initials

  const initialValues = {
      name, area, height, separacion, propTension,
    ...concretoInitials, ...frameIronInitials
  }
  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="losasplanas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )

}

const LosaInclinadaForm = ({budgetId, openModal, closeModal, setData}) => {
  const losaSchema = Yup.object().shape({
     name: Yup.string()
       .required('Requerido'),
     area: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     height: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
      separacion: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     })
  const LosaFormGroup = ({values, setFieldValue, errors, touched}) => (
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
  const getSteps = () => ([
    { label:'Especificaciones de Losa Inclinada',
      schema: losaSchema,
      form: LosaFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoFormGroup},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronFormGroup}
  ])
  const {name, area, height, separacion} = initials

  const initialValues = {
      name, area, height, separacion,
    ...concretoInitials, ...frameIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="losas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )
}

const RepelloCernidoForm = ({budgetId, openModal, closeModal, setData}) => {
  const costSchema = Yup.object().shape({
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
         preMix: Yup.mixed()
            .required('Requerido'),
         preMixPrice: Yup.mixed()
            .required('Requerido'),
         preMixWastePct: Yup.number(0)
              .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
   })
  //concretoSchema + recubrimiento

  const CostFormGroup = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <MorteroFormGroup values={values} setFieldValue={setFieldValue}
      errors={errors} touched={touched}/>
      <PreMixCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    </Fragment>
  )
  const getSteps = () => ([
    { label:'Especificaciones de Repellos y Cernido',
      schema: areaVolSchema,
      form: AreaVolFormGroup},
    { label:'Agregar Costos de Materiales',
      schema: costSchema,
      form: CostFormGroup}
  ])
  const {area, height} = initials

  const initialValues ={ name: 'REPELLO Y CERNIDO ', area, height, ...concretoInitials,
        preMixWastePct: 0}
  return(
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="repellos"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )
}

const MuroForm =({budgetId, openModal, closeModal, setData}) => {

  const muroSchema = Yup.object().shape({
     name: Yup.string()
       .required('Requerido'),
     area: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     junta: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     block: Yup.mixed()
         .required('Requerido'),
     blockPrice: Yup.mixed()
         .required('Requerido'),
     blockWastePct: Yup.number()
         .positive('Debe ser positivo')
         .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100'),

     })

  const MuroFormGroup = ({values, setFieldValue, errors, touched}) => (
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
  const getSteps = () => ([
    { label:'Especificaciones de Muro',
      schema: muroSchema,
      form: MuroFormGroup},
    { label:'Agregar costos de Mortero Pega',
      schema: morteroSchema,
      form: MorteroFormGroup}
  ])

  const {area} = initials

  const initialValues = {name: 'LEVANTAMIENTO DE MURO ', ...morteroInitials, area, blockWastePct: 0}
  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="muros"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}




export {SoleraForm, CimientoForm, ColumnaForm, ZapataForm,
        LosaPlanaForm, LosaInclinadaForm, RepelloCernidoForm, MuroForm}

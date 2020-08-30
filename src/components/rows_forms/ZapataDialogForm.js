import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import { Grid, TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';

import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress,Typography,  MenuItem, InputLabel, FormControl,
        InputAdornment} from '@material-ui/core'
import {Stepper, Step, StepLabel, StepContent} from '@material-ui/core';

import { Select } from 'formik-material-ui';
import api from '../../api'

import VolumeFields from './fields/Volume'
import CementCost from './costs/CementCost'
import SandCost from './costs/SandCost'
import GravelCost from './costs/GravelCost'
import Iron from './costs/Iron'
import TieWire from './costs/TieWire'
import ConcretoProp from './fields/ConcretoProp'

const Schemas = [
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
        cantTransElems: Yup.number()
          .positive('Deber ser positivo')
          .integer('Deber ser un número entero ')
          .required('Requerido'),

       }),

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
         })
      ]

 function getSteps() {
   return ['Especificaciones de Zapata', 'Agregar costos de Concreto', 'Agregar costos de Armazón'];
 }

export default function ZapataDialogForm(props) {

  const url           = `budgets/${props.budgetId}/zapatas`
  const title         = 'Zapata'
  const initialValue  = 'Zapata'

  //stepper state
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [serverState, setServerState] = useState();

  const isLastStep = () => {
    return activeStep === steps.length - 1;
  }

  const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


          const handleServerResponse = (ok, msg) => {
            setServerState({ok, msg});
          };
          const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
            console.log(values);
              if (isLastStep()) {
                console.log(values);
                const {name, amount, length, width, height,
                       recubrimiento, cantLongsElems, cantTransElems,
                       mixProp, cement, sand, gravel,
                       iron, tieWire,
                       cementPrice, sandPrice, gravelPrice,
                       ironPrice, tieWirePrice,
                       cementWastePct, sandWastePct, gravelWastePct,
                       ironWastePct, tieWireWastePct
                     } = values

                api.post(`${url}`, {name, amount, length, width, height,
                       recubrimiento, cantLongsElems, cantTransElems,
                       mixProp, cement, sand, gravel,
                       iron, tieWire,
                       cementPrice, sandPrice, gravelPrice,
                       ironPrice, tieWirePrice,
                       cementWastePct, sandWastePct, gravelWastePct,
                       ironWastePct, tieWireWastePct
                      })
                  .then(response => {
                    api.get(`${url}/${response.data.id}`)
                    .then(res => {
                      console.log(res.data)
                      const newData = res.data
                      props.setData(prevData => [newData, ...prevData])

                    })
                    setSubmitting(false);

                    resetForm();
                    handleServerResponse(true, "");
                    props.closeModal()
                    //agregar a la data general de la tabla materiales
                  })
                  .catch(error => {
                    setSubmitting(false);
                    // handleServerResponse(false, error.response.data.error);
                  });
              } else {
                setSubmitting(false)
                handleNext()
              }

          };




  return (

    <Dialog maxWidth='md' fullWidth open={props.openModal} onClose={() => props.closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Formik
          initialValues={{

                name: `${initialValue} `,
                cementWastePct: 0,
                sandWastePct: 0,
                gravelWastePct: 0,
                ironWastePct: 0,
                tieWireWastePct: 0,


            }}
          validationSchema={Schemas[activeStep]}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">

            {activeStep == 0 && (
                  <Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={8}>

                       <Field
                         component={TextField}
                         name="name"
                         type="text"
                         label="Nombre"
                         autoFocus
                         value={values.name}
                         onChange={e => setFieldValue('name', e.target.value)}
                       />
                       {errors.name && touched.name ? (
                         <div><Typography color='error' variant='caption'>{errors.name}</Typography></div>
                       ) : null}
                    </Grid>
                    <Grid item xs={4}>

                       <Field
                         component={TextField}
                         name="amount"
                         type="number"
                         label="Cantidad"
                         value={values.amount}
                         onChange={e => setFieldValue('amount', e.target.value)}
                       />
                       {errors.amount && touched.amount ? (
                         <div><Typography color='error' variant='caption'>{errors.amount}</Typography></div>
                       ) : null}
                    </Grid>
                  </Grid>
                  <VolumeFields errors={errors} touched={touched}  heightLabel='Peralte'/>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                     <Field
                     component={TextField}
                      name="recubrimiento"
                      type="number"
                      label="Recubrimiento"
                      value={values.recubrimiento}
                      onChange={e => setFieldValue('recubrimiento', e.target.value)}

                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            mts
                          </InputAdornment>
                        ),
                      }}
                    />

                    {errors.recubrimiento && touched.recubrimiento ? (
                      <div><Typography color='error' variant='caption'>{errors.recubrimiento}</Typography></div>
                    ) : null}
                    </Grid>

                    <Grid item xs={4}>
                      <Field
                      component={TextField}
                       name="cantLongsElems"
                       type="number"
                       label="Cantidad elementos longitudinales"
                       value={values.cantLongsElems}
                       onChange={e => setFieldValue('cantLongsElems', e.target.value)}

                     />
                     {errors.cantLongsElems && touched.cantLongsElems ? (
                       <div><Typography color='error' variant='caption'>{errors.cantLongsElems}</Typography></div>
                     ) : null}
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                      component={TextField}
                       name="cantTransElems"
                       type="number"
                       label="Cantidad elementos transversales"
                       value={values.cantTransElems}
                       onChange={e => setFieldValue('cantTransElems', e.target.value)}

                     />
                     {errors.cantTransElems && touched.cantTransElems ? (
                       <div><Typography color='error' variant='caption'>{errors.cantTransElems}</Typography></div>
                     ) : null}
                    </Grid>

                  </Grid>

                  </Fragment>
                )}
                {activeStep == 1 && (
                    <Fragment>
                      <ConcretoProp errors={errors} touched={touched} values={values}/>
                      <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                      <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                      <GravelCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                    </Fragment>
                  )}
                {activeStep == 2 && (
                    <Fragment>
                      <Iron values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                      <TieWire values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                    </Fragment>
                  )

              }






              {isSubmitting && <LinearProgress />}
              <br />
              <DialogActions>

                  <Button
                   color="inherit"
                   onClick={props.closeModal}>
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
                 {isSubmitting ? 'Submitting' : isLastStep() ? 'Enviar' : 'Siguiente'}
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

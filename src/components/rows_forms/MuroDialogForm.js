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

import CementCost from './costs/CementCost'
import SandCost from './costs/SandCost'
import BlockCost from './costs/BlockCost'
import MorteroProp from './fields/MorteroProp'

const Schemas = [
    Yup.object().shape({
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
                     cementWastePct: Yup.number()
                         .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                         .required(),
                     sandWastePct: Yup.number()
                       .positive('Debe ser positivo')
                       .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100'),
               })
             ]

 function getSteps() {
   return ['Especificaciones de Muro', 'Agregar costos de Mortero Pega '];
 }

export default function MuroDialogForm(props) {

  const url           = `budgets/${props.budgetId}/muros`

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
              if (isLastStep()) {
                console.log("datos enviados", values);
                const {name, area, junta,
                       block, blockPrice, blockWastePct,
                       mixProp, cement, sand,
                       cementPrice, sandPrice,
                       cementWastePct, sandWastePct
                      } = values
                api.post(`${url}`, {name, area, junta,
                       block, blockPrice, blockWastePct,
                       mixProp, cement, sand,
                       cementPrice, sandPrice,
                       cementWastePct, sandWastePct
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

                name: ``,
                blockWastePct: 0,
                cementWastePct: 0,
                sandWastePct: 0,



            }}
          validationSchema={Schemas[activeStep]}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">

            {activeStep == 0 && (
                  <Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>

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

                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Field
                      component={TextField}
                       name="area"
                       type="number"
                       label="Area"
                       value={values.area}
                       onChange={e => setFieldValue('area', e.target.value)}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                             {"\u33A1"}
                           </InputAdornment>
                         ),
                       }}
                     />
                     {errors.area && touched.area ? (
                       <div><Typography color='error' variant='caption'>{errors.area}</Typography></div>
                     ) : null}
                    </Grid>

                    <Grid item xs={6}>
                      <Field
                      component={TextField}
                       name="junta"
                       type="number"
                       label="Junta"
                       value={values.junta}
                       onChange={e => setFieldValue('junta', e.target.value)}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                            m
                           </InputAdornment>
                         ),
                       }}
                     />
                     {errors.junta && touched.junta ? (
                       <div><Typography color='error' variant='caption'>{errors.junta}</Typography></div>
                     ) : null}
                    </Grid>
                  </Grid>

                  <BlockCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

                  </Fragment>
                )}
                {activeStep == 1 && (
                    <Fragment>
                      <MorteroProp errors={errors} touched={touched} values={values}/>
                      <CementCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                      <SandCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                    </Fragment>
                  )}


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

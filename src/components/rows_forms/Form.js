import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper, InputAdornment } from '@material-ui/core';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText} from '@material-ui/core'
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import * as Yup from 'yup';


import VolumeFields from './fields/Volume'
import ConcretoProp from './fields/ConcretoProp'
import CementCost from './costs/CementCost'
import SandCost from './costs/SandCost'
import GravelCost from './costs/GravelCost'


const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

export default function Home(props) {
  return (
    <Dialog maxWidth='md' fullWidth open={props.openModal} onClose={() => props.closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <FormikStepper
          handleBack = {props.handleBack}
          closeModal = {props.closeModal}
          initialValues={{
            name: 'Solera ',
            cementWastePct: 0,
            sandWastePct: 0,
            gravelWastePct: 0,
            longIronWastePct: 0,
            transIronWastePct: 0,
            tieWireWastePct: 0,

          }}
          onSubmit={async (values) => {
            console.log('values', values);
            await sleep(3000);
            console.log('values', values);
          }}
        >
          <FormikStep label="Especificaciones de Solera"
              validationSchema={Yup.object().shape({
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
                    .positive('Deber ser positivo'),
                 cantLongsElems: Yup.number()
                    .positive('Deber ser positivo')
                    .required('Requerido'),
                 separacion: Yup.number()
                    .positive('Deber ser positivo')
                    .required('Requerido'),
                 longHook: Yup.number()
                    .positive('Deber ser positivo')
                    .required('Requerido'),
                })
              }
          >
            <Box paddingBottom={2}>
                <Field
                  component={TextField}
                  name="name"
                  type="text"
                  label="Nombre"
                />
            </Box>
            <Box paddingBottom={2}>
              <VolumeFields />
            </Box>
            <Box paddingBottom={2}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Field
                  component={TextField}
                   name="recubrimiento"
                   type="number"
                   label="Recubrimiento"
                   helperText= "Opcional"
                   InputProps={{
                     endAdornment: (
                       <InputAdornment position="end">
                         mts
                       </InputAdornment>
                     ),
                   }}
                 />
              </Grid>
              <Grid item xs={6}>
                  <Field
                  component={TextField}
                   name="cantLongsElems"
                   type="number"
                   label="Cantidad elementos longitudinales"
                 />
               </Grid>
               </Grid>
            </Box>
            <Box paddingBottom={2}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                <Field
                component={TextField}
                 name="separacion"
                 type="number"
                 label="Separacion Estribos"
                 InputProps={{
                   endAdornment: (
                     <InputAdornment position="end">
                      mts
                     </InputAdornment>
                   ),
                 }}
               />
               </Grid>
               <Grid item xs={6}>
                  <Field
                  component={TextField}
                   name="longHook"
                   type="number"
                   label="Largo Gancho"

                   InputProps={{
                     endAdornment: (
                       <InputAdornment position="end">
                        mts
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>
               </Grid>
            </Box>

          </FormikStep>
          <FormikStep
            label="Agregar Costos de Concreto"
            validationSchema={Yup.object().shape({
                mixProp: Yup.mixed()
                    .required('Requerido'),
                cement: Yup.mixed()
                    .required('Requerido'),
                // cementPrice: Yup.mixed()
                //     .required('Requerido'),
                // sand: Yup.mixed()
                //    .required('Requerido'),
                // sandPrice: Yup.mixed()
                //    .required('Requerido'),
                // gravel: Yup.mixed()
                //    .required('Requerido'),
                // gravelPrice: Yup.mixed()
                //    .required('Requerido'),
                // cementWastePct: Yup.number()
                //     .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                //     .default(0)
                //     .required(),
                // sandWastePct: Yup.number()
                //     .positive('Debe ser positivo')
                //     .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                //     .default(0),
                // gravelWastePct: Yup.number()
                //       .positive('Debe ser positivo')
                //       .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                //       .default(0),
              })
            }
          >
            <Box paddingBottom={2}>
                <ConcretoProp/>
                <CementCost />
                <SandCost />
                <GravelCost />

            </Box>
          </FormikStep>
          <FormikStep label="Agregar Costos de Armazón">
            <Box paddingBottom={2}>
              <Field fullWidth name="description" component={TextField} label="Description" />
            </Box>
          </FormikStep>
        </FormikStepper>
        </DialogContent>

        </Dialog>
  );
}

// export interface FormikStepProps
//   extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
//   label: string;
// }

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (

    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
        }
      }}
    >
      {({ isSubmitting,  setFieldValue, values }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <DialogActions>



          <Button
           color="inherit"
           onClick={props.closeModal}>
              Cancelar
           </Button>

           {step > 0 ? (
               <Button
                 disabled={isSubmitting}
                 variant="outlined"
                 onClick={() => setStep((s) => s - 1)}

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

        </Form>
      )}
    </Formik>


  );
}

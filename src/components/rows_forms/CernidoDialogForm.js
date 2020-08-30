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
import AssignmentIcon from '@material-ui/icons/Assignment';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

import { Select } from 'formik-material-ui';
import api from '../../api'

import PreMixCost from './costs/PreMixCost'

const TitleIcon = () => <DonutLargeIcon fontSize='large' color='primary' />

const Schema = Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
               area: Yup.number()
                .positive('Deber ser positivo')
                .required('Requerido'),
               preMix: Yup.mixed()
                  .required('Requerido'),
               preMixPrice: Yup.mixed()
                  .required('Requerido'),
               preMixWastePct: Yup.number(0)
                    .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100')
                  
       })


export default function MezclaConcretoDialogForm(props) {

  const url           = `budgets/${props.budgetId}/cernidos`
  const initialValue  = `Cernido`

  //stepper state

  const [serverState, setServerState] = useState();


          const handleServerResponse = (ok, msg) => {
            setServerState({ok, msg});
          };
          const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
            console.log(values);

                const {name, area,
                       preMix, preMixPrice, preMixWastePct
                      } = values
                api.post(`${url}`, {name, area,
                       preMix, preMixPrice, preMixWastePct
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


          };




  return (

    <Dialog maxWidth='md' fullWidth open={props.openModal} onClose={() => props.closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <Stepper alternativeLabel>
            <Step key={`Cernido`}>
              <StepLabel StepIconComponent={TitleIcon}> {`Ingresar Especificaciones de Cernido`}</StepLabel>
            </Step>
        </Stepper>
        <Formik
          initialValues={{

                name: `${initialValue} `,
                preMixWastePct: 0,


            }}
          validationSchema={Schema}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">

                  <Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={9}>

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
                    <Grid item xs={3}>
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

                  </Grid>
                  <PreMixCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

                  </Fragment>

              {isSubmitting && <LinearProgress />}
              <br />
              <DialogActions>

                  <Button
                   color="inherit"
                   onClick={props.closeModal}>
                      Cancelar
                   </Button>



               <Button
                 startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                 disabled={isSubmitting}
                 variant="contained"
                 color="primary"
                 type="submit"
                 onClick={submitForm}
               >
                 {isSubmitting ? 'Enviando' : 'Enviar' }
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

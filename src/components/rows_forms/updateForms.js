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
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField, BooleanField} from './inputFields'



import {ConcretoProp, MorteroProp} from './propFields'


import {concretoGroup, morteroGroup, frameIronGroup, frameBiIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup} from './formGroups'



import api from '../../api'

const [transQuantitySchema, TransQuantityForm] = transQuantityGroup

const TitleIcon = () => <DonutLargeIcon fontSize='large' color='primary' />


const UpdateForm = ({apiId, budgetId,
                     form, title, formData,
                     validationSchema, open, closeModal}) => {

  const url= `budgets/${budgetId}/${apiId}`

  const [serverState, setServerState] = useState();

  // const refreshRow = () => {
  //   api.get(`${props.rowUrl}`)
  //   .then(res => {
  //     const dataUpdate = [...props.rowsData]
  //     const index = props.rowData.tableData.id
  //     const updatedRow = {...res.data, tableData: props.rowData.tableData}
  //     dataUpdate[index] = updatedRow
  //     props.setRowsData([...dataUpdate])
  //
  //   })
  //   .catch(err => console.log(err))
  //
  //
  // }

  const handleServerResponse = (ok, msg) => {
    setServerState({ok, msg});
  };
  const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
        api.put(`${url}/${formData.id}`, {...values})
          .then(response => {
            setSubmitting(false);
            handleServerResponse(true, "");
            closeModal()
          })
          .catch(error => {
            setSubmitting(false);
            handleServerResponse(false, "Ocurrio un error");
          });
  };


  return (

    <Dialog maxWidth='md' fullWidth open={open} onClose={() => closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <Stepper alternativeLabel>
            <Step key={`${title}`}>
              <StepLabel StepIconComponent={TitleIcon}> {`Actualizar especificaciones de ${title}`}</StepLabel>
            </Step>
        </Stepper>
        <Formik

          enableReinitialize
          initialValues={{
            ...formData}}
          validationSchema={validationSchema}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">

                <form.inner values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

              {isSubmitting && <LinearProgress />}
              <br />
              <DialogActions>

                  <Button
                   color="inherit"
                   onClick={closeModal}>
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
                 {isSubmitting ? 'Enviando' : 'Actualizar' }
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

const ColumnaForm = ({budgetId, rowId, open, closeModal}) => {
  const [columna, setColumna] = useState({})

  useEffect(() => {
    api.get(`budgets/${budgetId}/columnas/${rowId}`)
    .then(res => setColumna(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
            <Fragment>
              <TransQuantityForm values={values} setFieldValue={setFieldValue}
                errors={errors} touched={touched}/>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ConcretoProp errors={errors} touched={touched} value={columna.mixProp}/>
                </Grid>
              </Grid>
            </Fragment>
    )
  }
  return(
    <UpdateForm apiId="columnas" title="Columna"
      form={{inner: Form}} formData={columna} validationSchema={transQuantitySchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

export {ColumnaForm}

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

import api from '../../../api'

const TitleIcon = () => <DonutLargeIcon fontSize='large' color='primary' />


export default function UpdateForm(props) {

  const url= `budgets/${props.budgetId}/${props.url}`

  //stepper state

  const [serverState, setServerState] = useState();

  const refreshRow = () => {
    api.get(`${props.rowUrl}`)
    .then(res => {
      const dataUpdate = [...props.rowsData]
      const index = props.rowData.tableData.id
      const updatedRow = {...res.data, tableData: props.rowData.tableData}
      dataUpdate[index] = updatedRow
      props.setRowsData([...dataUpdate])

    })
    .catch(err => console.log(err))


  }
          const handleServerResponse = (ok, msg) => {
            setServerState({ok, msg});
          };
          const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
            console.log(values);


                api.put(`${url}/${props.actualData.id}`, {...values})
                  .then(response => {

                    setSubmitting(false);

                    refreshRow()
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

    <Dialog maxWidth='md' fullWidth open={props.open} onClose={() => props.closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <Stepper alternativeLabel>
            <Step key={`${props.title}`}>
              <StepLabel StepIconComponent={TitleIcon}> {`Actualizar especificaciones de ${props.title}`}</StepLabel>
            </Step>
        </Stepper>
        <Formik

          enableReinitialize
          initialValues={{
            ...props.actualData}}

          validationSchema={props.validationSchema}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">

                <props.form values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

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

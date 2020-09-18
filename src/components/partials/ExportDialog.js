import React, {useState, useEffect, Fragment} from 'react'

import { makeStyles } from '@material-ui/core/styles';

import {Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button,
        LinearProgress, CircularProgress, InputAdornment} from '@material-ui/core';
import {SaveAlt} from '@material-ui/icons'
import { Formik, Form, Field } from 'formik';
import {NameField} from '../inputFields'

import * as Yup from 'yup';
import moment from 'moment'
var idLocale = require('moment/locale/es');
moment.locale('es', idLocale);




export default function ExportDialog({open, onClose, onConfirm, data, showTitle, ...other}) {
  const info = data[0] || {budget: {name: '', project: {name: ''}}}
  console.log('DATA EN EXPORT', data);
  const budgetName =  info.budget.name.toUpperCase()
  const projectName = info.budget.project.name.toUpperCase()

  useEffect(() => {}, [data] )

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onConfirm(data);
    onClose();
  };

  const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
    const {name} = values
    console.log(name);
    setTimeout(() => {
      onConfirm(data, name);
      setSubmitting(false)

      onClose();

    }, 500)


  };

  const [serverState, setServerState] = useState();

  return (
    <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="md"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">{showTitle()}</DialogTitle>
            <Formik
            enableReinitialize // missing piece!!

             initialValues={{name: `PRESUPUESTO ${budgetName} ${projectName} ${moment().format('LL')}`}}
             validationSchema={
               Yup.object().shape({
                  name: Yup.string()
                        .required('Requerido'),
                })}
             onSubmit={handleOnSubmit}
             >
             {({submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
               <Form>
               <DialogContent dividers>

                   <Grid container spacing={4}>
                       <Grid item xs={12}>
                       <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}
                          helperText='Nombre del archivo de excel' fieldProps={{
                            autoFocus: true,
                            fullWidth: true,
                            multiline: true,
                            endAdornment: (
                            <InputAdornment position="end">
                              .xlsx
                            </InputAdornment>
                          )}}/>
                       </Grid>
                   </Grid>
                 {isSubmitting && <LinearProgress />}
                 <br />

                 {serverState && (
                   <p className={!serverState.ok ? "errorMsg" : ""}>
                     {serverState.msg}
                   </p>
                 )}

                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleCancel} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={submitForm} color="primary"
                    startIcon={isSubmitting ? <CircularProgress size="1rem" /> : <SaveAlt />}>

                    EXPORTAR
                  </Button>
                </DialogActions>
            </Form>
          )}
        </Formik>

      </Dialog>
  )
}

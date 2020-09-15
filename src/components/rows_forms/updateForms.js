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
        SquareMeterField, PercentageField, BooleanField} from '../inputFields'


import {ConcretoProp, MorteroProp} from './propFields'

import {name, area, junta} from '../schemas'

import {concretoGroup, morteroGroup, frameIronGroup, frameBiIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup, columnaEspecialGroup,
        zapataGroup, losaPlanaGroup, losaInclinadaGroup} from './formGroups'



import api from '../../api'

const [transQuantitySchema, TransQuantityForm] = transQuantityGroup
const [zapataSchema, ZapataFormGroup] = zapataGroup
const [losaPlanaSchema, LosaPlanaSpecsForm] = losaPlanaGroup
const [losaInclinadaSchema, LosaInclinadaSpecsForm] = losaInclinadaGroup
const [transMeterSchema, TransMeterForm] = transMeterGroup
const [areaVolSchema, AreaVolForm] = areaVolGroup
const [columnaEspecialSchema, ColumnaEspecialSpecsForm] = columnaEspecialGroup



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
          validationSchema={Yup.object().shape({...validationSchema})}

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

const ZapataForm = ({budgetId, rowId, open, closeModal}) => {
  const [zapata, setZapata] = useState({})
  const apiId = 'zapatas'

  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setZapata(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => (
        <Fragment>
          <ZapataFormGroup values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={zapata.mixProp}/>
            </Grid>
          </Grid>
        </Fragment>
    )


  return(
    <UpdateForm apiId={apiId} title="Zapata"
      form={{inner: Form}} formData={zapata} validationSchema={zapataSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const LosaPlanaForm = ({budgetId, rowId, open, closeModal}) => {
  const [losa, setLosa] = useState({})
  const apiId = 'losasplanas'

  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setLosa(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => (
        <Fragment>
          <LosaPlanaSpecsForm values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={losa.mixProp}/>
            </Grid>
          </Grid>
        </Fragment>
    )


  return(
    <UpdateForm apiId={apiId} title="Zapata"
      form={{inner: Form}} formData={losa} validationSchema={losaPlanaSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const LosaInclinadaForm = ({budgetId, rowId, open, closeModal}) => {
  const [losa, setLosa] = useState({})
  const apiId = 'losas'

  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setLosa(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => (
        <Fragment>
          <LosaInclinadaSpecsForm values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={losa.mixProp}/>
            </Grid>
          </Grid>
        </Fragment>
    )


  return(
    <UpdateForm apiId={apiId} title="Zapata"
      form={{inner: Form}} formData={losa} validationSchema={losaInclinadaSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const CimientoCorridoForm = ({budgetId, rowId, open, closeModal}) => {
  const [cimiento, setCimiento] = useState({})
  const apiId = 'cimcorridos'

  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setCimiento(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => (
        <Fragment>
          <TransMeterForm values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={cimiento.mixProp}/>
            </Grid>
          </Grid>
        </Fragment>
    )


  return(
    <UpdateForm apiId={apiId} title="Cimiento Corrido"
      form={{inner: Form}} formData={cimiento} validationSchema={transMeterSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const SoleraForm = ({budgetId, rowId, open, closeModal}) => {
  const [solera, setSolera] = useState({})
  const apiId = 'soleras'

  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setSolera(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => (
        <Fragment>
          <TransMeterForm values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={solera.mixProp}/>
            </Grid>
          </Grid>
        </Fragment>
    )


  return(
    <UpdateForm apiId={apiId} title="Solera"
      form={{inner: Form}} formData={solera} validationSchema={transMeterSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
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

const ColumnaEspecialForm = ({budgetId, rowId, open, closeModal}) => {

  const [columna, setColumna] = useState({})
  const apiId = 'columnasespeciales'
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setColumna(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
        <Fragment>
          <ColumnaEspecialSpecsForm values={values} setFieldValue={setFieldValue}
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
    <UpdateForm apiId={apiId} title="Columna Especial"
      form={{inner: Form}} formData={columna} validationSchema={columnaEspecialSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const MuroForm = ({budgetId, rowId, open, closeModal}) => {
  const [muro, setMuro] = useState({})
  const apiId = 'muros'
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setMuro(res.data))
    .catch(err => console.log(err))
  }, [open])

  const formSchema = {name, area, junta}
  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <MorteroProp errors={errors} touched={touched} value={muro.mixProp}/>
              </Grid>
            </Grid>
          </Fragment>
    )
  }
  return(
    <UpdateForm apiId={apiId} title="Muro"
      form={{inner: Form}} formData={muro} validationSchema={formSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const MezclonMorteroForm = ({budgetId, rowId, open, closeModal}) => {
  const [mezclon, setMezclon] = useState({})
  const apiId = 'mezclones'
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setMezclon(res.data))
    .catch(err => console.log(err))
  }, [open])


  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
         <Fragment>
            <AreaVolForm values={values} setFieldValue={setFieldValue}
              errors={errors} touched={touched}/>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <MorteroProp errors={errors} touched={touched} value={mezclon.mixProp}/>
              </Grid>
            </Grid>
          </Fragment>
    )
  }
  return(
    <UpdateForm apiId={apiId} title="Mezclón de Mortero"
      form={{inner: Form}} formData={mezclon} validationSchema={areaVolSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const MezclonConcretoForm = ({budgetId, rowId, open, closeModal}) => {
  const [mezclon, setMezclon] = useState({})
  const apiId = 'extmezclones'
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setMezclon(res.data))
    .catch(err => console.log(err))
  }, [open])


  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
         <Fragment>
            <AreaVolForm values={values} setFieldValue={setFieldValue}
              errors={errors} touched={touched}/>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <ConcretoProp errors={errors} touched={touched} value={mezclon.mixProp}/>
              </Grid>
            </Grid>
          </Fragment>
    )
  }
  return(
    <UpdateForm apiId={apiId} title="Mezclón de Concreto"
      form={{inner: Form}} formData={mezclon} validationSchema={areaVolSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const RepelloForm = ({budgetId, rowId, open, closeModal}) => {
  const [repello, setRepello] = useState({})
  const apiId = 'repellos'
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setRepello(res.data))
    .catch(err => console.log(err))
  }, [open])


  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
         <Fragment>
            <AreaVolForm values={values} setFieldValue={setFieldValue}
              errors={errors} touched={touched}/>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <MorteroProp errors={errors} touched={touched} value={repello.mixProp}/>
              </Grid>
            </Grid>
          </Fragment>
    )
  }
  return(
    <UpdateForm apiId={apiId} title="Repello y Cernido"
      form={{inner: Form}} formData={repello} validationSchema={areaVolSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

export {ZapataForm, LosaPlanaForm, LosaInclinadaForm, CimientoCorridoForm,
        SoleraForm, ColumnaForm, ColumnaEspecialForm, MuroForm, MezclonMorteroForm,
        MezclonConcretoForm, RepelloForm}

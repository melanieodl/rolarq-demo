import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import columnImg from '../../imgs/columna.png';
import HelpImg from '../partials/HelpImg'
import { Grid, TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';

import {Dialog, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress,Typography,  MenuItem, InputLabel, FormControl,
        InputAdornment} from '@material-ui/core'
import DialogTitle from '../partials/DialogTitle'

import {Stepper, Step, StepLabel, StepContent} from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField, BooleanField} from '../inputFields'


import {ConcretoProp, MorteroProp} from './propFields'

import {name, area, junta, wallArea, ceilArea} from '../schemas'

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
                     validationSchema, open, closeModal,
                     maxWidth}) => {

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

    <Dialog maxWidth={maxWidth || 'md'} fullWidth open={open} onClose={() => closeModal} aria-labelledby="form-dialog-title">
      <DialogTitle onClose={closeModal}>
        <Stepper alternativeLabel>
            <Step key={`${title}`}>
              <StepLabel StepIconComponent={TitleIcon}> {`Actualizar especificaciones de ${title}`}</StepLabel>
            </Step>
        </Stepper>
        </DialogTitle>
        <Formik

          enableReinitialize
          initialValues={{
            ...formData}}
          validationSchema={Yup.object().shape({...validationSchema})}

          onSubmit={handleOnSubmit}

        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">
              <DialogContent dividers>


                <form.inner values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

              {isSubmitting && <LinearProgress />}
              <br />
              </DialogContent>
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

        </Dialog>

  );
}

const ZapataForm = ({open, closeModal, rowData}) => {
  const [zapata, setZapata] = useState({})
  const apiId = 'zapatas'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const LosaPlanaForm = ({open, closeModal, rowData}) => {
  const [losa, setLosa] = useState({})
  const apiId = 'losasplanas'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const LosaInclinadaForm = ({open, closeModal, rowData}) => {
  const [losa, setLosa] = useState({})
  const apiId = 'losas'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const CimientoCorridoForm = ({open, closeModal, rowData}) => {
  const [cimiento, setCimiento] = useState({})
  const apiId = 'cimcorridos'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const SoleraForm = ({open, closeModal, rowData}) => {
  const [solera, setSolera] = useState({})
  const apiId = 'soleras'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const ColumnaForm = ({open, closeModal, rowData}) => {
  const [columna, setColumna] = useState({})
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
  useEffect(() => {
    api.get(`budgets/${budgetId}/columnas/${rowId}`)
    .then(res => setColumna(res.data))
    .catch(err => console.log(err))
  }, [open])





  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
            <Grid container alignItems="center">
              <Grid item xs={3}>
                 <HelpImg image={columnImg}/>
              </Grid>
              <Grid item xs={9}>
                  <TransQuantityForm values={values} setFieldValue={setFieldValue}
                    errors={errors} touched={touched}/>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ConcretoProp errors={errors} touched={touched} value={columna.mixProp}/>
                    </Grid>
                  </Grid>
              </Grid>
            </Grid>

    )
  }
  return(
    <UpdateForm apiId="columnas" title="Columna"
      form={{inner: Form}} formData={columna} validationSchema={transQuantitySchema}
      budgetId={budgetId} open={open} closeModal={closeModal} maxWidth='lg'/>
  )
}

const ColumnaEspecialForm = ({open, closeModal, rowData}) => {

  const [columna, setColumna] = useState({})
  const apiId = 'columnasespeciales'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setColumna(res.data))
    .catch(err => console.log(err))
  }, [open])

  const Form = ({values, setFieldValue, errors, touched}) => {
    return (
      <Grid container alignItems="center">
        <Grid item xs={3}>
           <HelpImg image={columnImg}/>
        </Grid>
        <Grid item xs={9}>
          <ColumnaEspecialSpecsForm values={values} setFieldValue={setFieldValue}
            errors={errors} touched={touched}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <ConcretoProp errors={errors} touched={touched} value={columna.mixProp}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  return(
    <UpdateForm apiId={apiId} title="Columna Especial"
      form={{inner: Form}} formData={columna} validationSchema={columnaEspecialSchema}
      budgetId={budgetId} open={open} closeModal={closeModal} maxWidth='lg'/>
  )
}

const MuroForm = ({open, closeModal, rowData}) => {
  const [muro, setMuro] = useState({})
  const apiId = 'muros'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const MezclonMorteroForm = ({open, closeModal, rowData}) => {
  const [mezclon, setMezclon] = useState({})
  const apiId = 'mezclones'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const MezclonConcretoForm = ({open, closeModal, rowData}) => {
  const [mezclon, setMezclon] = useState({})
  const apiId = 'concmezclones'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const MezclonExtForm = ({open, closeModal, rowData}) => {
  const [mezclon, setMezclon] = useState({})
  const apiId = 'extmezclones'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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
    <UpdateForm apiId={apiId} title="Concreteado de Garage y Banquetas"
      form={{inner: Form}} formData={mezclon} validationSchema={areaVolSchema}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

const RepelloForm = ({open, closeModal, rowData}) => {
  const [repello, setRepello] = useState({})
  const apiId = 'repellos'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
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

const PinturaForm = ({open, closeModal, rowData}) => {
  const [pintura, setPintura] = useState({})
  const apiId = 'pinturas'
  const {budget} = rowData
  const {id: budgetId} = budget
  const {id: rowId} = rowData
  useEffect(() => {
    api.get(`budgets/${budgetId}/${apiId}/${rowId}`)
    .then(res => setPintura(res.data))
    .catch(err => console.log(err))
  }, [open])


  const Form = ({values, setFieldValue, errors, touched}) => (
     <Fragment>
       <Grid container spacing={4}>
         <Grid item xs={12}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
         </Grid>
       </Grid>
       <Grid container spacing={4}>
         <Grid item xs={6}>
           <SquareMeterField name="wallArea" label="Area de Pared" value={values.wallArea} helperText='Area de paredes interiores/exteriores'
           setFieldValue={setFieldValue} errors={errors} touched={touched}/>
         </Grid>
         <Grid item xs={6}>
           <SquareMeterField name="ceilArea" label="Area de Cielo" value={values.ceilArea} helperText='Area de superficies de cielo (Opcional)'
           setFieldValue={setFieldValue} errors={errors} touched={touched}/>
         </Grid>
       </Grid>
     </Fragment>)

  return(
    <UpdateForm apiId={apiId} title="Pintura Interior/Exterior"
      form={{inner: Form}} formData={pintura}
      validationSchema={{ name, wallArea, ceilArea}}
      budgetId={budgetId} open={open} closeModal={closeModal}/>
  )
}

export {ZapataForm, LosaPlanaForm, LosaInclinadaForm, CimientoCorridoForm,
        SoleraForm, ColumnaForm, ColumnaEspecialForm, MuroForm, MezclonMorteroForm,
        MezclonConcretoForm, RepelloForm, PinturaForm, MezclonExtForm}

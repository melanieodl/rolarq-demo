import React, {useState, Fragment} from 'react'
import api from '../../api'
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid, CircularProgress} from '@material-ui/core'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';

import {NameField, LinearMeterField, QuantityField, VolumeFields } from '../inputFields'

import * as Yup from 'yup';

const CreateForm = ({schema, apiId, title, label, initialValues,
                     openModal, closeModal, setData, Specs}) => {

  const [serverState, setServerState] = useState();
  const handleServerResponse = (ok, msg) => {
    setServerState({ok, msg});
  };
  const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
    api.post(`${apiId}`, {...values})
      .then(response => {
        api.get(`${apiId}/${response.data.id}`)
        .then(res => {
          console.log(res.data)
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
        handleServerResponse(false, error.response.data.error);
      });
  };

        return (
          <Dialog maxWidth='sm' fullWidth open={openModal} onClose={() => closeModal} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Nuevo {title}</DialogTitle>
          <DialogContent>
           <DialogContentText>
             Agregar {label} a materiales
           </DialogContentText>
              <Formik
               initialValues={{name: ''}}
               validationSchema={
                 Yup.object().shape({
                    name: Yup.string()
                    .required('Requerido'),
                  })}
               onSubmit={handleOnSubmit}
             >
               {({submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
                 <Form>
                     <Grid container spacing={4}>
                         <Grid item xs={12}>
                         <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
                         </Grid>
                     </Grid>
                     {Specs && <Specs values={values} setFieldValue={setFieldValue}
                             errors={errors} touched={touched} />}
                   {isSubmitting && <LinearProgress />}
                   <br />
                   <DialogActions>

                   <Button
                     color="inherit"
                     onClick={closeModal}
                   >
                     Cancelar
                   </Button>

                   <Button
                     startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                     disabled={isSubmitting}
                     variant="contained"
                     color="primary"
                     onClick={submitForm}
                   >
                     {isSubmitting ? 'Enviando' : 'Enviar'}
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
        )
}


const CementForm = ({openModal, closeModal, setData}) => (
  <CreateForm apiId="cements" title="Cemento" label="cemento"
      openModal={openModal} closeModal={closeModal} setData={setData}/>
)

const SandForm = ({openModal, closeModal, setData}) => (
  <CreateForm apiId="sands" title="Arena" label="arena"
      openModal={openModal} closeModal={closeModal} setData={setData}/>
)

const GravelForm = ({openModal, closeModal, setData}) => (
  <CreateForm apiId="gravels" title="Piedrin" label="piedrin"
      openModal={openModal} closeModal={closeModal} setData={setData}/>
)

const IronForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <LinearMeterField name='length' label='Largo Útil' value={values.length}
            setFieldValue={setFieldValue} errors={errors} touched={touched}/>
        </Grid>
      </Grid>
    </Fragment>
  )

  return (
    <CreateForm apiId='irons' title='Hierro' label='hierro' Specs={SpecsForm}
      openModal={openModal} closeModal={closeModal} setData={setData}/>)

}

const TieWireForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <QuantityField name='knotsPerPound' label='Nudos / Lb' value={values.knotsPerPound}
            setFieldValue={setFieldValue} errors={errors} touched={touched}/>
        </Grid>
      </Grid>
    </Fragment>
  )

  return (
    <CreateForm apiId='tiewires' title='Alambre de Amarre' label='alambre' Specs={SpecsForm}
      openModal={openModal} closeModal={closeModal} setData={setData}/>)

}

const BlockForm = ({openModal, closeModal, setData}) =>  (
    <CreateForm apiId='blocks' title='BlockForm' label='block' Specs={VolumeFields}
      openModal={openModal} closeModal={closeModal} setData={setData}/>
)

const CoverPreMixForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <QuantityField name='sqrMtsPerBag' label='&#13217; / bolsa' value={values.sqrMtsPerBag}
            setFieldValue={setFieldValue} errors={errors} touched={touched}/>
        </Grid>
      </Grid>
    </Fragment>
  )

  return (
    <CreateForm apiId='premixes' title='Recubrimiento Premezclado' label='recubrimiento premezclado'
      Specs={SpecsForm} openModal={openModal} closeModal={closeModal} setData={setData}/>)

}



export {CementForm, SandForm, GravelForm, IronForm, TieWireForm, BlockForm, CoverPreMixForm}

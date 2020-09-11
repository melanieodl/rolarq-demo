import React, {useState, Fragment} from 'react'
import api from '../../api'
import * as Yup from 'yup';

import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid, CircularProgress, InputAdornment, FormHelperText} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import {VolumeFields, LinearMeterField } from '../inputFields'

const UpdateForm = ({materialUrl, id, materialData, materialsData, setMaterialsData,
                     apiId, specs, validationSchema, FormSpecs}) => {

  const [serverState, setServerState] = useState();

  const refreshMaterial = () => {
    api.get(`${materialUrl}/${id}`)
    .then(res => {
      const dataUpdate = [...materialsData]
      const index = materialData.tableData.id
      const updatedMaterial = {...res.data, tableData: materialData.tableData}
      dataUpdate[index] = updatedMaterial
      setMaterialsData([...dataUpdate])

    })
    .catch(err => console.log(err))

  }
  const handleServerResponse = (ok, msg) => {
    setServerState({ok, msg});
  };
  const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
    // const {name} = values

    api.put(`${apiId}/${id}/specs`, {...values})
      .then(response => {
        setSubmitting(false);
        refreshMaterial()
        console.log('values', values);
        handleServerResponse(true, "");
      })
      .catch(error => {
        setSubmitting(false);
        handleServerResponse(false, error.response.data.error);
      });
  };

  return (
        <Formik
           enableReinitialize // missing piece!!
           initialValues={{
             ...specs
           }}
           validationSchema={validationSchema}
           onSubmit={handleOnSubmit}
       >
         {({ values, setFieldValue, errors, touched, submitForm, isSubmitting }) => (
           <Form>

           <Grid
              container
              spacing={3}
              >
            <Grid container item
                xs={12}
                spacing={3}
                direction="row"
                justify="space-between"
                alignItems="center">
                 <Grid item xs={10}>
                    <FormSpecs values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                 </Grid>

               {isSubmitting && <LinearProgress />}
               <br />

               {serverState && (
                 <p className={!serverState.ok ? "errorMsg" : ""}>
                   {serverState.msg}
                 </p>
               )}

               <Grid item style={{paddingRight: 0}}
                  xs={2}>
                   <Button
                    variant="contained"
                    style={{float: 'right'}}
                    color="primary"
                    size="small"
                    disabled={isSubmitting}
                    onClick={submitForm}
                    startIcon={isSubmitting ? <CircularProgress size="1rem" /> : <SaveIcon />}
                    >
                    GUARDAR
                    </Button>
               </Grid>

              </Grid>
            </Grid>
         </Form>
         )}

       </Formik>
  )
}


const IronForm = ({id, specs, apiId, materialData, tableData,
                    materialsData, setMaterialsData}) => {
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name='length'
              type="number"
              label="Longitud"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    m
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
      </Fragment>
  )

  return (
    <UpdateForm apiId='irons' id={id} specs={specs} FormSpecs={FormFields}
    materialUrl={apiId}  materialData={materialData} tableData={tableData}
    materialsData={materialsData} setMaterialsData={setMaterialsData}
    validationSchema={{}}
    />
  )
}

const TieWireForm = ({id, specs, apiId, materialData, tableData,
                    materialsData, setMaterialsData}) => {
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
          <Grid item xs={12}>
            <Field
              id="knotsPerPound"
              component={TextField}
              name={`knotsPerPound`}
              type="number"
              label="Nudos / Libra"
            />
            <FormHelperText id="knotsPerPound-text">Cantidad de nudos por libra de alambre</FormHelperText>
          </Grid>
      </Fragment>
  )

  return (
    <UpdateForm apiId='tiewires' id={id} specs={specs} FormSpecs={FormFields}
    materialUrl={apiId}  materialData={materialData} tableData={tableData}
    materialsData={materialsData} setMaterialsData={setMaterialsData}
    validationSchema={{}}
    />
  )
}

const BlockForm = ({id, specs, apiId, materialData, tableData,
                    materialsData, setMaterialsData}) => {
  const validationSchema = Yup.object().shape({
     length: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     width: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
     height: Yup.number()
      .positive('Deber ser positivo')
      .required('Requerido'),
   });
  const FormFields = () => (
         <Fragment>
               <VolumeFields />
               <Grid item xs={1} />
         </Fragment>
     )

  return (
    <UpdateForm apiId='blocks' id={id} specs={specs} FormSpecs={FormFields}
    materialUrl={apiId}  materialData={materialData} tableData={tableData}
    materialsData={materialsData} setMaterialsData={setMaterialsData}
    validationSchema={validationSchema}
    />
  )
}

const CoverPreMixForm = ({id, specs, apiId, materialData, tableData,
                    materialsData, setMaterialsData}) => {
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
          <Grid item xs={12}>
          <Field
            id='sqrMtsPerBag'
            component={TextField}
            name={`sqrMtsPerBag`}
            type="number"
            label="&#13217; / bolsa"
          />
            <FormHelperText id="sqrMtsPerBag-text">Rendimiento: Cantidad de &#13217; por bolsa</FormHelperText>
          </Grid>
      </Fragment>
  )

  return (
    <UpdateForm apiId='premixes' id={id} specs={specs} FormSpecs={FormFields}
    materialUrl={apiId}  materialData={materialData} tableData={tableData}
    materialsData={materialsData} setMaterialsData={setMaterialsData}
    validationSchema={{}}
    />
  )
}


export {BlockForm, IronForm, TieWireForm, CoverPreMixForm}

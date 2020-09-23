import React, {useState, useEffect, Fragment} from 'react'
import api from '../../api'
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import blockImg from '../../imgs/block.png';
import HelpImg from '../partials/HelpImg'

import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid, CircularProgress, InputAdornment, FormHelperText,
        FormControl, Select, MenuItem, InputLabel, Typography} from '@material-ui/core'
import {Stepper, Step, StepLabel} from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import {VolumeFields, LinearMeterField, NameField, SquareMeterField, QuantityField } from '../inputFields'

import {name, length, width, height, area, knotsPerPound, sqrMtsPerBag, sqrMtsPerGal} from '../schemas'

import MaterialIcon from '@material-ui/icons/LocalMall';

const TitleIcon = () => <MaterialIcon fontSize='large' color='primary' />


const UpdateForm = ({apiId, id, rowData,
                     materialsData, setMaterialsData,
                     validationSchema, FormMaterial,
                     maxWidth, open, closeModal, title,
                     image, imgSpacing}) => {

  const [serverState, setServerState] = useState();

  const refreshMaterial = () => {
    api.get(`${apiId}/${id}`)
    .then(res => {
      const dataUpdate = [...materialsData]
      const index = rowData.tableData.id
      const updatedMaterial = {...res.data, tableData: rowData.tableData}
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

    api.put(`${apiId}/${id}`, {...values})
      .then(response => {
        setSubmitting(false);
        refreshMaterial()
        console.log('values', values);
        handleServerResponse(true, "");
        closeModal()
      })
      .catch(error => {
        setSubmitting(false);
        handleServerResponse(false, error.response.data.error);
      });
  };

  return (
    <Dialog maxWidth={maxWidth || 'md'} fullWidth open={open} onClose={() => closeModal} aria-labelledby="form-dialog-title">
    <DialogContent>
        <Stepper alternativeLabel>
            <Step key={`${title}`}>
              <StepLabel StepIconComponent={TitleIcon}> {`Editar ${title || `Material`}`}</StepLabel>
            </Step>
        </Stepper>
        <Formik
           enableReinitialize // missing piece!!
           initialValues={{
             ...rowData
           }}
           validationSchema={Yup.object().shape({
                 ...validationSchema
               })}
           onSubmit={handleOnSubmit}
       >
         {({ values, setFieldValue, errors, touched, submitForm, isSubmitting }) => (
           <Form>
                 <Grid container spacing={4} alignItems="center">
                     {image && <Grid item xs={imgSpacing|| 4}>
                      <HelpImg image={image}/>
                     </Grid>}
                     <Grid item xs={12 - (imgSpacing || 0)}>
                      <FormMaterial values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
                      </Grid>
                  </Grid>


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
         </Form>
         )}

       </Formik>
       </DialogContent>
       </Dialog>
  )
}

const CapForm = ({ open, closeModal, rowData,
                    rowsData, setRowsData}) => {
  const {id} =  rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
        </Grid>
  )

  return (
    <UpdateForm apiId='materials' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name}}
    />
  )
}

const IronForm = ({ open, closeModal, rowData,
                    rowsData, setRowsData}) => {
  const {id} =  rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={4}>
            <Field
              component={TextField}
              name='length'
              type="number"
              label="Largo Útil"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    m
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
  )

  return (
    <UpdateForm apiId='irons' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, length}}
    />
  )
}

const TieWireForm = ({open, closeModal, rowData,
                      rowsData, setRowsData}) => {
  const {id} =  rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              id="knotsPerPound"
              component={TextField}
              name={`knotsPerPound`}
              type="number"
              label="Nudos / Libra"
            />
            <FormHelperText id="knotsPerPound-text">Cantidad de nudos por libra de alambre</FormHelperText>
          </Grid>
      </Grid>
  )

  return (
    <UpdateForm apiId='tiewires' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, knotsPerPound}}
    />
  )
}

const BlockForm = ({open, closeModal, rowData,
                      rowsData, setRowsData}) => {
  const {id} = rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
        <Grid container spacing={3}>
              <Grid item xs={12}>
                <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
              </Grid>
              <Grid item xs={12}>
               <VolumeFields />
              </Grid>
         </Grid>
     )

  return (
    <UpdateForm apiId='blocks' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, length, width, height}}
    image={blockImg} imgSpacing={4}
    />
  )
}

const CoverPreMixForm = ({open, closeModal, rowData,
                          rowsData, setRowsData}) => {
  const {id} = rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
          <Field
            id='sqrMtsPerBag'
            component={TextField}
            name={`sqrMtsPerBag`}
            type="number"
            label="&#13217; / bolsa"
          />
            <FormHelperText id="sqrMtsPerBag-text">Rendimiento: Cantidad de &#13217; por bolsa</FormHelperText>
          </Grid>
      </Grid>
  )

  return (
    <UpdateForm apiId='premixes' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, sqrMtsPerBag}}
    />
  )
}

const ElectromallaForm = ({open, closeModal, rowData,
                          rowsData, setRowsData}) => {
  const {id} = rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SquareMeterField name='area' label='Area' value={values.area}
              helperText='Superficie de la plancha de electromalla'
              setFieldValue={setFieldValue} errors={errors} touched={touched}/>
          </Grid>
      </Grid>
  )

  return (
    <UpdateForm apiId='electromallas' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, area}}
    />
  )
}
const PaintForm = ({open, closeModal, rowData,
                          rowsData, setRowsData}) => {
  const {id} = rowData
  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <QuantityField name='sqrMtsPerGal' label='&#13217; / &#13311;' value={values.sqrMtsPerGal}
              helperText='Rendimiento: Cantidad de metros cuadrados por galón de pintura'
              setFieldValue={setFieldValue} errors={errors} touched={touched}/>
          </Grid>
      </Grid>
  )

  return (
    <UpdateForm apiId='paints' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, sqrMtsPerGal}}
    />
  )
}
const MaterialForm = ({ open, closeModal, rowData,
                    rowsData, setRowsData}) => {
  const {id} =  rowData
  const [units, setUnits] = useState([])

  useEffect(() => {
    api.get('units')
    .then(response => {
      setUnits(response.data)
    })
    .catch(err => {
    })
  }, [])

  const useStyles = makeStyles({
      denseItem:{
      paddingTop: 0,
      paddingBottom: 0,
    },
  });

  const classes = useStyles()

  const FormFields = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
              <FormControl>
                <InputLabel htmlFor="unit">{`Unidad de Medida`}</InputLabel>
                <Field
                  component={Select}
                  disabled={units.length === 0}
                  name='unit'
                  onChange = {(evt, child) => setFieldValue('unit', evt.target.value)}
                  defaultValue= {values.unit ? values.unit : null }
                  displayEmpty
                  renderValue={value => value ? <MenuItem dense className={classes.denseItem} value={value}>{`${value.name}`}</MenuItem> : ''}
                  inputProps={{
                    id: 'mix-prop',

                  }}
                >
                  {units.map(unit => <MenuItem dense value={unit}>{unit.name}</MenuItem>)}
                </Field>
                {errors["unit"] && touched["unit"] ? (
                  <div><Typography color='error' variant='caption'>{errors["unit"]}</Typography></div>
                ) : null}

              </FormControl>
          </Grid>
        </Grid>
  )

  return (
    <UpdateForm apiId='materials' id={id} FormMaterial={FormFields}
    rowData={rowData} materialsData={rowsData} setMaterialsData={setRowsData}
    open={open} closeModal={closeModal}
    validationSchema={{name, unit: Yup.mixed().required('Unidad es requerido')}}
    />
  )
}


export {BlockForm, IronForm, TieWireForm, CoverPreMixForm,
CapForm as CementForm, CapForm as SandForm, CapForm as GravelForm,
MaterialForm, ElectromallaForm, PaintForm}

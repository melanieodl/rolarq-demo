import React, {useState, useEffect, Fragment} from 'react'
import api from '../../api'
import { makeStyles } from '@material-ui/core/styles';
import blockImg from '../../imgs/block.png';
import HelpImg from '../partials/HelpImg'
import {Dialog, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid, CircularProgress} from '@material-ui/core'
import DialogTitle from '../partials/DialogTitle'

import {Stepper, Step, StepLabel, InputLabel, Select, MenuItem, Typography,
        FormControl} from '@material-ui/core';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';

import {NameField, LinearMeterField, SquareMeterField, QuantityField,
        VolumeFields } from '../inputFields'

import AddPricesTb from '../tables/partials/AddPricesTb'

import {name, area, length, width, height, knotsPerPound, sqrMtsPerBag, sqrMtsPerGal} from '../schemas'

import * as Yup from 'yup';
import MaterialIcon from '@material-ui/icons/LocalMall';

const TitleIcon = () => <MaterialIcon fontSize='large' color='primary' />

const CreateForm = ({schema, apiId, title, label, initialValues,
                     openModal, closeModal, setData, FormFields,
                     maxWidth, image, imgSpacing}) => {

  //prices que se agregan
  const [prices, setPrices] = useState([])

  const [serverState, setServerState] = useState();
  const handleServerResponse = (ok, msg) => {
    setServerState({ok, msg});
  };
  const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
    console.log('values', values);
    api.post(`${apiId}`, {...values, prices: prices})
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
          <Dialog maxWidth={maxWidth || 'md'} fullWidth open={openModal} onClose={() => closeModal} aria-labelledby="form-dialog-title">
          <DialogTitle onClose={closeModal} id="confirmation-dialog-title">
              <Stepper alternativeLabel>
                  <Step key={`${title}`}>
                    <StepLabel StepIconComponent={TitleIcon}> {`Agregar ${title || `Material`}`}</StepLabel>
                  </Step>
              </Stepper>
          </DialogTitle>
          <DialogContent dividers>

              <Formik
               initialValues={{...initialValues}}
               validationSchema={
                 Yup.object().shape({
                    name,
                    ...schema
                  })}
               onSubmit={handleOnSubmit}
             >
               {({submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
                 <Form>
                     <Grid container spacing={4} alignItems="center">
                         {image && <Grid item xs={12} sm={imgSpacing|| 4}>
                          <HelpImg image={image}/>
                         </Grid>}
                         <Grid item xs={12} sm={12 - (imgSpacing || 0)}>
                         {FormFields && <FormFields values={values} setFieldValue={setFieldValue}
                                 errors={errors} touched={touched} />}
                          </Grid>
                          <Grid item xs={12}>
                            <AddPricesTb title='Precios' label="precio" prices={prices} setPrices={setPrices}/>
                          </Grid>

                      </Grid>

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

const NameForm = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
      </Grid>
    </Grid>
)

const FieldForm = ({values, setFieldValue, errors, touched, Field, name, label, helperText}) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
          <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field name={name} label={label} helperText={helperText}
        value={values[name]} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
      </Grid>
    </Grid>
)
const CementForm = ({openModal, closeModal, setData}) =>(
  <CreateForm apiId="cements" title="Cemento" label="cemento"
      openModal={openModal} closeModal={closeModal} setData={setData}
      FormFields={NameForm} initialValues={{name: 'Cemento '}} />
)

const SandForm = ({openModal, closeModal, setData}) => (
  <CreateForm apiId="sands" title="Arena" label="arena"
      openModal={openModal} closeModal={closeModal} setData={setData}
      FormFields={NameForm} initialValues={{name: 'Arena '}}/>
)

const GravelForm = ({openModal, closeModal, setData}) => (
  <CreateForm apiId="gravels" title="Piedrin" label="piedrin"
      openModal={openModal} closeModal={closeModal} setData={setData}
      FormFields={NameForm} initialValues={{name: 'Piedrin '}}/>
)

const IronForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
      <FieldForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}
        Field={LinearMeterField} name='length' label='Largo Útil' />
  )

  return (
    <CreateForm apiId='irons' title='Hierro' label='hierro' FormFields={SpecsForm}
      openModal={openModal} closeModal={closeModal} setData={setData} schema={{length}}
      initialValues={{name: 'Hierro '}}/>)

}

const TieWireForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <FieldForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}
      Field={QuantityField} name='knotsPerPound' label='Nudos / Lb' helperText='Cantidad de nudos por libra de alambre'/>
  )

  return (
    <CreateForm apiId='tiewires' title='Alambre de Amarre' label='alambre' FormFields={SpecsForm}
      openModal={openModal} closeModal={closeModal} setData={setData} schema={{knotsPerPound}}
      initialValues={{name: 'Alambre de amarre '}}/>)

}

const BlockForm = ({openModal, closeModal, setData}) =>  {
  const Form = ({values, setFieldValue, errors, touched}) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
      </Grid>
      <Grid item xs={12}>
          <VolumeFields values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
      </Grid>
    </Grid>
  )
    return(
      <CreateForm apiId='blocks' title='Block' label='block' FormFields={Form}
      openModal={openModal} closeModal={closeModal} setData={setData} schema={{length, width, height}}
      maxWidth='md' image={blockImg} imgSpacing={4} initialValues={{name: 'Block '}}/>
    )}


const CoverPreMixForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (

        <FieldForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}
          Field={SquareMeterField} name='sqrMtsPerBag' label='&#13217; / bolsa'
          helperText='Rendimiento: Cantidad de &#13217; por bolsa'/>

  )

  return (
    <CreateForm apiId='premixes' title='Recubrimiento Premezclado' label='recubrimiento premezclado'
      FormFields={SpecsForm} openModal={openModal} closeModal={closeModal} setData={setData} schema={{sqrMtsPerBag}}
      initialValues={{name: ''}}/>)

}

const PaintForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <FieldForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}
      Field={SquareMeterField}  name='sqrMtsPerGal' label='&#13217; / &#13311;'
      helperText='Rendimiento: Cantidad de metros cuadrados por galón de pintura'/>
  )

  return (
    <CreateForm apiId='paints' title='Pintura' label='pintura'
      FormFields={SpecsForm} openModal={openModal} closeModal={closeModal} setData={setData} schema={{sqrMtsPerGal}}
      initialValues={{name: 'Pintura '}}/>)

}

const ElectromallaForm = ({openModal, closeModal, setData}) => {
  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <FieldForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}
      Field={SquareMeterField}  name='area' label='Area'
      helperText='Superficie de la plancha de electromalla'/>
  )

  return (
    <CreateForm apiId='electromallas' title='Electromalla' label='electromalla'
      FormFields={SpecsForm} openModal={openModal} closeModal={closeModal} setData={setData} schema={{area}}
      initialValues={{name: 'Electromalla '}}/>)

}
const MaterialForm = ({ openModal, closeModal, setData}) => {
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
      <CreateForm apiId='materials' label='material'
      FormFields={FormFields} openModal={openModal} closeModal={closeModal} setData={setData}
      schema={{name, unit: Yup.mixed().required('Unidad es requerido')}}/>
  )
}

export {CementForm, SandForm, GravelForm, IronForm, TieWireForm, BlockForm, CoverPreMixForm, PaintForm,
        ElectromallaForm, MaterialForm}

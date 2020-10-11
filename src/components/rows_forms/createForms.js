import React, {useState, useEffect, Fragment} from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import api from '../../api'
import * as Yup from 'yup';
import columnImg from '../../imgs/columna.png';
import HelpImg from '../partials/HelpImg'
import {Stepper, Step, StepLabel, StepContent,
        Grid, TextField, CircularProgress } from '@material-ui/core'

import {Dialog, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress,Typography,  MenuItem, InputLabel, FormControl,
        InputAdornment} from '@material-ui/core'
import DialogTitle from '../partials/DialogTitle'

import { Autocomplete } from "@material-ui/lab";
import { Formik, Form, Field } from "formik";
import { Select } from 'formik-material-ui';

import {PreMixCost, BlockCost, WallPaintCost, CeilPaintCost, ElectromallaCost} from './costFields'

import {NameField, LinearMeterField, QuantityField,
        SquareMeterField, PercentageField, BooleanField,
        VolumeFields} from '../inputFields'

import {name, amount, length, width, height,
        unitAmount, unit, profitPct,
        wallArea, ceilArea,
        cantLongsElems, cantLongsAuxElems,
        recubrimiento, separacion,
        longHook, longPata,
        estribosDouble,
        mixProp,
        cement, cementPrice, cementWastePct,
        sand, sandPrice, sandWastePct,
        preMix, preMixPrice, preMixWastePct,
        wallPaint, wallPaintPrice, wallPaintWastePct,
        ceilPaint, ceilPaintPrice, ceilPaintWastePct,
        electromalla, electromallaPrice, electromallaWastePct} from '../schemas'


import {concretoGroup, morteroGroup, frameIronGroup, frameBiIronGroup, frameTriIronGroup,
        areaVolGroup, transMeterGroup, transQuantityGroup,
        zapataGroup, losaPlanaGroup, losaInclinadaGroup, muroGroup} from './formGroups'

const [concretoSchema, ConcretoForm] = concretoGroup
const [morteroSchema, MorteroForm] = morteroGroup
const [frameIronSchema, FrameIronForm] = frameIronGroup
const [frameBiIronSchema, FrameBiIronForm] = frameBiIronGroup
const [frameTriIronSchema, FrameTriIronForm] = frameTriIronGroup
const [transMeterSchema, TransMeterForm] = transMeterGroup
const [transQuantitySchema, TransQuantityForm] = transQuantityGroup
const [areaVolSchema, AreaVolForm] = areaVolGroup
const [zapataSchema, ZapataFormGroup] = zapataGroup
const [losaPlanaSchema, LosaPlanaSpecsForm] = losaPlanaGroup
const [losaInclinadaSchema, LosaInclinadaSpecsForm] = losaInclinadaGroup
const [muroSchema, MuroSpecsForm] = muroGroup


const useStyles = makeStyles((theme) => ({
  soloInput: {
    textAlign: 'right'
  },
}));


const initials =  {
    name: ``,
    amount: ``,
    length: '',
    width: '',
    height: '',
    area: '',
    recubrimiento: '',
    separacion: '',
    longHook: '',
    longPata: '',
    cantLongsElems: '',
    cantTransElems: '',
    propTension: ''
  }

const concretoInitials = {
      cementWastePct: 0,
      sandWastePct: 0,
      gravelWastePct: 0,
}

const morteroInitials = {
      cementWastePct: 0,
      sandWastePct: 0,
}

const frameBiIronInitials = {
  longIronWastePct: 0,
  transIronWastePct: 0,
  tieWireWastePct: 0,
}

const frameTriIronInitials = {
  ...frameBiIronInitials,
  longIronAuxWastePct: 0,
}

const frameIronInitials = {
  ironWastePct: 0,
  tieWireWastePct: 0,
}

const EmptyForm = props => <Fragment />

const CreateForm = ({getSteps, budgetId, apiId,
                     initialValues,
                     openModal, closeModal,
                     setData, errors, touched, values, setFieldValue,
                     maxWidth}) => {


    const url = `budgets/${budgetId}/${apiId}`

    //stepper state
    const [activeStep, setActiveStep] = React.useState(0);
    const [step, setStep] = useState({label: '', form: EmptyForm , schema: Yup.object().shape({})})
    const steps = getSteps();
    const [serverState, setServerState] = useState();

    useEffect(() => {setStep(steps[0])
                      }, [])

    const isLastStep = () => {
      return activeStep === steps.length - 1;
    }

    const handleNext = () => {
        setStep(steps[activeStep + 1]);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };

    const handleBack = () => {
        setStep(steps[activeStep - 1]);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

      };

    const handleServerResponse = (ok, msg) => {
        setServerState({ok, msg});
      };

    const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
          if (isLastStep()) {
            console.log('values', values);
            api.post(`${url}`, values)
              .then(response => {
                api.get(`${url}/${response.data.id}`)
                .then(res => {
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
                // handleServerResponse(false, error.response.data.);
              });
          } else {
            setSubmitting(false)
            handleNext()
          }

      };


    return (

      <Dialog maxWidth={maxWidth  || 'md'} fullWidth open={openModal} onClose={() => closeModal} aria-labelledby="form-dialog-title">
          <DialogTitle onClose={closeModal}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(({label}) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </DialogTitle>
          <Formik
          enableReinitialize // missing piece!!

            initialValues={{...initialValues}}
            validationSchema={Yup.object().shape({...step.schema})}
            onSubmit={handleOnSubmit}

          >
            {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form autoComplete="off">
              <DialogContent dividers>

                <step.form values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>

                  {isSubmitting && <LinearProgress />}
                  <br />
                </DialogContent>
                  <DialogActions>

                      <Button
                       color="inherit"
                       onClick={closeModal}>
                          Cancelar
                       </Button>

                       {activeStep > 0 ? (
                           <Button
                             disabled={isSubmitting}
                             variant="outlined"
                             onClick={handleBack}
                           >
                             Atrás
                           </Button>
                       ) : null}



                   <Button
                     startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                     disabled={isSubmitting}
                     variant="contained"
                     color="primary"
                     type="submit"
                   >
                     {isSubmitting ? 'Enviando' : isLastStep() ? 'Enviar' : 'Siguiente'}
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

const SoleraForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Solera',
      schema: transMeterSchema,
      form: TransMeterForm},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form:  FrameBiIronForm}
  ])

  const {length, width, height, recubrimiento, cantLongsElems, separacion,
    longHook} = initials

  const initialValues = {
    name: `SOLERA `,
    length, width, height, recubrimiento, cantLongsElems, separacion, longHook,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="soleras" initialValues={initialValues}
                setData={setData}
                openModal={openModal} closeModal={closeModal}/>
  )
}

const CimientoForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Cimiento',
      schema: transMeterSchema,
      form: TransMeterForm},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form:  FrameBiIronForm}
  ])

  const {length, width, height, recubrimiento, cantLongsElems, separacion,
    longHook} = initials

  const initialValues = {
    name: `CIMIENTO CORRIDO `,
    length, width, height, recubrimiento, cantLongsElems, separacion, longHook,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="cimcorridos" initialValues={initialValues}
                setData={setData}
                openModal={openModal} closeModal={closeModal}/>
  )
}

const ColumnaForm = ({budgetId, openModal, closeModal, setData}) => {
  const classes = useStyles()
  const getSteps = () => ([
    { label:'Especificaciones de Columna',
      schema: transQuantitySchema,
      form: ({values, setFieldValue, errors, touched}) => (
        <Grid container alignItems="center">
          <Grid item xs={12} xs={3}>
             <HelpImg image={columnImg}/>
          </Grid>
          <Grid item xs={12} xs={9}>
          <TransQuantityForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
          </Grid>
        </Grid>
      )},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameBiIronSchema,
      form:  FrameBiIronForm}
  ])

  const {amount, length, width, height, recubrimiento,
    cantLongsElems,
    separacion, longPata, longHook} = initials

  const initialValues = {
    name: `COLUMNA `, amount, length, width, height,
    recubrimiento, cantLongsElems, separacion, longHook, longPata,
    ...concretoInitials, ...frameBiIronInitials
  }

  return (<CreateForm getSteps={getSteps} budgetId={budgetId} apiId="columnas" initialValues={initialValues}
                    setData={setData}
                    openModal={openModal} closeModal={closeModal}
                    maxWidth='lg'/>)
}

const ZapataForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Zapata',
      schema: zapataSchema,
      form: ZapataFormGroup},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronForm}
  ])

  const {amount, length, width, height, recubrimiento,
    cantLongsElems,  cantTransElems,
    separacion, longPata, longHook} = initials

  const initialValues = {
    name: 'ZAPATA ', amount, length, width, height,
    recubrimiento, cantLongsElems, cantTransElems,
    ...concretoInitials, ...frameIronInitials
  }

  return(
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="zapatas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )

}

const LosaPlanaForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Losa Plana',
      schema: losaPlanaSchema,
      form: LosaPlanaSpecsForm},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronForm}
  ])
  const {name: nameInitial, area, height, separacion, propTension} = initials

  const initialValues = {
      nameInitial, area, height, separacion, propTension,
    ...concretoInitials, ...frameIronInitials
  }
  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="losasplanas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )

}

const LosaInclinadaForm = ({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Losa Inclinada',
      schema: losaInclinadaSchema,
      form: LosaInclinadaSpecsForm},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameIronSchema,
      form: FrameIronForm}
  ])
  const {name: nameInitial, area, height, separacion} = initials

  const initialValues = {
      nameInitial, area, height, separacion,
    ...concretoInitials, ...frameIronInitials
  }

  return (
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="losas"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )
}

const RepelloCernidoForm = ({budgetId, openModal, closeModal, setData}) => {
  const costSchema = {
        mixProp,
        cement, cementPrice, cementWastePct,
        sand, sandPrice, sandWastePct,
        preMix, preMixPrice, preMixWastePct,
   }
  //concretoSchema + recubrimiento

  const CostFormGroup = ({values, setFieldValue, errors, touched}) => (
    <Fragment>
      <MorteroForm values={values} setFieldValue={setFieldValue}
      errors={errors} touched={touched}/>
      <PreMixCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
    </Fragment>
  )
  const getSteps = () => ([
    { label:'Especificaciones de Repellos y Cernido',
      schema: areaVolSchema,
      form: AreaVolForm},
    { label:'Agregar Costos de Materiales',
      schema: costSchema,
      form: CostFormGroup}
  ])
  const {area, height} = initials

  const initialValues ={ name: 'REPELLO Y CERNIDO ', area, height, ...concretoInitials,
        preMixWastePct: 0}
  return(
    <CreateForm getSteps={getSteps} budgetId={budgetId} apiId="repellos"
    initialValues={initialValues} setData={setData}
    openModal={openModal} closeModal={closeModal}/>
  )
}

const MuroForm =({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Muro',
      schema: muroSchema,
      form: MuroSpecsForm},
    { label:'Agregar costos de Mortero Pega',
      schema: morteroSchema,
      form: MorteroForm}
  ])

  const {area} = initials

  const initialValues = {name: 'LEVANTAMIENTO DE MURO ', ...morteroInitials, area, blockWastePct: 0}
  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="muros"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}

const MezclonConcretoForm =({budgetId, openModal, closeModal, setData}) => {


  const getSteps = () => ([
    { label:'Especificaciones de Mezclón de Concreto',
      schema: areaVolSchema,
      form: AreaVolForm},
    { label:'Agregar costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm}
  ])

  const {name: nameInitial, area, height} = initials
  const initialValues = {nameInitial, area, height, ...morteroInitials}

  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="concmezclones"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}

const MezclonMorteroForm =({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Especificaciones de Mezclón de Mortero',
      schema: areaVolSchema,
      form: AreaVolForm},
    { label:'Agregar costos de Mortero',
      schema: morteroSchema,
      form: MorteroForm}
  ])

  const {name: nameInitial, area, height} = initials
  const initialValues = {nameInitial, area, height, ...morteroInitials}

  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="mezclones"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}

const MezclonExtForm =({budgetId, openModal, closeModal, setData}) => {


  const getSteps = () => ([
    { label:'Especificaciones de Mezclón de Garage y Banquetas',
      schema: areaVolSchema,
      form: AreaVolForm},
    { label:'Agregar costos de Materiales',
      schema: {...concretoSchema, electromalla,
                  electromallaPrice, electromallaWastePct},
      form: ({values, setFieldValue, errors, touched}) => (
            <Fragment>
              <ConcretoForm values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
              <ElectromallaCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
            </Fragment>)}
  ])

  const {name: nameInitial, area, height} = initials
  const initialValues = {nameInitial, area, height, ...morteroInitials}

  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="extmezclones"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}

const ColumnaEspecialForm = ({budgetId, openModal, closeModal, setData}) => {
  const classes = useStyles();

  const specsSchema = {
    name, profitPct, amount, length, width, height,
    estribosDouble, recubrimiento, cantLongsElems, cantLongsAuxElems,
    separacion, longHook, longPata
  }


  const SpecsForm = ({values, setFieldValue, errors, touched}) => (
    <Grid container alignItems="center">
        <Grid container xs={12} sm={3}>
           <HelpImg image={columnImg}/>
        </Grid>
        <Grid container spacing={3} xs={12} sm={9}>
             <Grid item xs={12} sm={8}>
                <NameField value={values.name} setFieldValue={setFieldValue}
                errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={2}>
                <QuantityField name="amount" label="Cantidad" value={values.amount}
                setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={2}>
               <PercentageField name="profitPct" label="Pct. Utilidad" value={values.profitPct}
                setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
             </Grid>
             <Grid item xs={12}>
                <VolumeFields lengthLabel='Altura' heightLabel='Largo'/>
             </Grid>
            <Grid item xs={12} sm={6}>
              <QuantityField name="cantLongsElems" label="Cantidad Elementos Esquinas"
              value={values.cantLongsElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuantityField name="cantLongsAuxElems" label="Cantidad Elementos Auxiliares"
              value={values.cantLongsAuxElems} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
            </Grid>
             <Grid item xs={12} sm={6}>
               <LinearMeterField name="longPata" label="Largo Patas"
               value={values.longPata} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={6}>
               <LinearMeterField name="longHook" label="Largo Gancho"
                 value={values.longHook} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={6}>
               <LinearMeterField name="separacion" label="Separacion Estribos"
               value={values.separacion} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={6}>
               <LinearMeterField name="recubrimiento" label="Recubrimiento" value={values.recubrimiento}
               setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid xs={12}
                container
                direction="row-reverse"
                justify="flex-start"
                alignItems="center"
              >
               <Grid item alignItems="flex-end" className={classes.soloInput} xs={6} sm={3}>
                 <BooleanField name="estribosDouble" label="Estribos dobles" />
               </Grid>
             </Grid>
          </Grid>
        </Grid>
   )

  // const armazonSchema =
  // const ArmazonForm

  const getSteps = () => ([
    { label:'Especificaciones de Columna Especial',
      schema: specsSchema,
      form: SpecsForm},
    { label:'Agregar Costos de Concreto',
      schema: concretoSchema,
      form: ConcretoForm},
    { label:'Agregar Costos de Armazón',
      schema: frameTriIronSchema,
      form:  FrameTriIronForm}
  ])

  // const initialValues = {name: 'COLUMNA'}



    const frameInitials = {}

    const initialValues = {
      name: `COLUMNA `, amount: '', length: '', width: '', height: '',
      recubrimiento: '', cantLongsElems: '', cantLongsAuxElems: '',  estribosDouble: false,
      separacion: '', longHook: '', longPata: '',
      ...concretoInitials, ...frameTriIronInitials
    }

  return(
          <CreateForm getSteps={getSteps} initialValues={initialValues} apiId="columnasespeciales"
          budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData} maxWidth='lg'/>
        )
}

const PinturaForm =({budgetId, openModal, closeModal, setData}) => {

  const getSteps = () => ([
    { label:'Pintura Exterior y Exterior',
      schema: { name, profitPct, wallArea, ceilArea,
                wallPaint, wallPaintPrice, wallPaintWastePct,
                ceilPaint, ceilPaintPrice, ceilPaintWastePct,
              },
      form: ({values, setFieldValue, errors, touched}) => (
        <Grid container spacing={3}>
             <Grid item xs={12} sm={9}>
                <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={3}>
               <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
                setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
             </Grid>
             <Grid item xs={12} sm={6}>
               <SquareMeterField name="wallArea" label="Area de Pared" value={values.wallArea} helperText='Area de paredes interiores/exteriores'
               setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12} sm={6}>
               <SquareMeterField name="ceilArea" label="Area de Cielo" value={values.ceilArea} helperText='Area de superficies de cielo (Opcional)'
               setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12}>
                <WallPaintCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>
             <Grid item xs={12}>
                <CeilPaintCost values={values} setFieldValue={setFieldValue} errors={errors} touched={touched}/>
             </Grid>

         </Grid>)},
  ])

  const initialValues = {name: 'PINTURA INTERIOR/EXTERIOR', wallArea: '', ceilArea: ''}

  return(<CreateForm getSteps={getSteps} initialValues={initialValues} apiId="pinturas"
    budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>)
}


const RowForm = ({budgetId, openModal, closeModal, setData}) => {

  const FormFields = ({values, setFieldValue, errors, touched, url}) => {

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
    return(
    <Grid container spacing={3}>
          <Grid item xs={12}>
            <NameField value={values.name} setFieldValue={setFieldValue} errors={errors} touched={touched} />
          </Grid>
          <Grid item xs={12} sm={4}>
             <QuantityField name="unitAmount" label="Cantidad" value={values.unitAmount}
             setFieldValue={setFieldValue} errors={errors} touched={touched}/>
          </Grid>
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={3}>
            <PercentageField name="profitPct" label="Pct. de Utilidad" value={values.profitPct}
             setFieldValue={setFieldValue} errors={errors} touched={touched} optional={true}/>
          </Grid>
        </Grid>
  )}

  const getSteps = () => [
    {
      label: 'Crear Renglon',
      schema: {name, unitAmount, unit, profitPct},
      form: FormFields
    }
  ]

  return (
        <CreateForm getSteps={getSteps} initialValues={{name: '', unit: '', unitAmount: '', profitPct: ''}} apiId='rows'
        budgetId={budgetId} openModal={openModal} closeModal={closeModal} setData={setData}/>
  )
}

export {SoleraForm, CimientoForm, ColumnaForm, ColumnaEspecialForm, ZapataForm,
        LosaPlanaForm, LosaInclinadaForm,
        RepelloCernidoForm, MuroForm,
        MezclonConcretoForm, MezclonMorteroForm, MezclonExtForm,
        PinturaForm,
        RowForm}

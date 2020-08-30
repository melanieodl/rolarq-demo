import React, {useState} from 'react'
import api from '../../api'
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid} from '@material-ui/core'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as Yup from 'yup';


const Schema = Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
                 sqrMtsPerBag: Yup.number()
                  .positive('Deber ser positivo')
                  .required('Requerido'),

       })

export default function SingleNameForm(props) {
  const url           = 'premixes'
  const title         = 'Recubrimiento Premezclado'
  const label         = 'recubrimiento premezclado'
  const initialValue  = ''

  const [serverState, setServerState] = useState();
        const handleServerResponse = (ok, msg) => {
          setServerState({ok, msg});
        };
        const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
          const {name, sqrMtsPerBag} = values
          api.post(`${url}`, {name, sqrMtsPerBag})
            .then(response => {
              api.get(`${url}/${response.data.id}`)
              .then(res => {
                console.log(res.data)
                const newData = res.data
                props.setData(prevData => [newData, ...prevData])

              })
              setSubmitting(false);

              resetForm();
              handleServerResponse(true, "");
              props.closeModal()
              //agregar a la data general de la tabla materiales
            })
            .catch(error => {
              setSubmitting(false);
              handleServerResponse(false, error.response.data.error);
            });
        };

        return (
          <Dialog maxWidth='sm' fullWidth open={props.openModal} onClose={() => props.closeModal} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Nuevo {title}</DialogTitle>
          <DialogContent>
           <DialogContentText>
             Agregar {label} a materiales
           </DialogContentText>
              <Formik
               initialValues={{
                 name: `${initialValue} `,
               }}
               validationSchema={Schema}

               onSubmit={handleOnSubmit}
             >
               {({ submitForm, isSubmitting }) => (
                 <Form>
                 <Grid container spacing={3}>
                  <Grid container item xs={12} spacing={3}>
                    <Grid item xs={12}>
                       <Field
                         component={TextField}
                         name="name"
                         type="text"
                         label="Nombre"
                       />
                    </Grid>
                  </Grid>


                      <Grid container item xs={12} spacing={3}>
                        <Grid item xs={12}>
                          <Field
                          component={TextField}
                           name="sqrMtsPerBag"
                           type="number"
                           label="&#13217; / bolsa"
                         />
                        </Grid>

                      </Grid>
                    </Grid>


                   {isSubmitting && <LinearProgress />}
                   <br />
                   <DialogActions>

                   <Button
                     variant="outlined"
                     color="inherit"
                     onClick={props.closeModal}
                   >
                     Cancelar
                   </Button>
                   <Button
                     variant="contained"
                     color="primary"
                     disabled={isSubmitting}
                     onClick={submitForm}
                   >
                     Enviar
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

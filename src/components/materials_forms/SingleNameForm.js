import React, {useState} from 'react'
import api from '../../api'
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress} from '@material-ui/core'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';


const Schema = Yup.object().shape({
               name: Yup.string()
                 .required('Requerido'),
       })


export default function SingleNameForm(props) {

  const [serverState, setServerState] = useState();
        const handleServerResponse = (ok, msg) => {
          setServerState({ok, msg});
        };
        const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
          const {name} = values
          api.post(`${props.url}`, {name})
            .then(response => {
              api.get(`${props.url}/${response.data.id}`)
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
          <DialogTitle id="form-dialog-title">Nuevo {props.title}</DialogTitle>
          <DialogContent>
           <DialogContentText>
             Agregar {props.label} a materiales
           </DialogContentText>
              <Formik
               initialValues={{
                 name: `${props.initialValue} `,
               }}

               validationSchema={Schema}


               onSubmit={handleOnSubmit}
             >
               {({ submitForm, isSubmitting }) => (
                 <Form>
                   <Field
                     component={TextField}
                     name="name"
                     type="text"
                     label="Nombre"
                   />
                   <br />

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

import React, {useState} from 'react'
import api from '../../../api'
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
        Button, LinearProgress, Grid} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';


export default function SingleNameForm(props) {


  const refreshMaterial = () => {
    api.get(`${props.materialUrl}/${props.id}`)
    .then(res => {
      const dataUpdate = [...props.materialsData]
      const index = props.materialData.tableData.id
      const updatedMaterial = {...res.data, tableData: props.materialData.tableData}
      dataUpdate[index] = updatedMaterial
      props.setMaterialsData([...dataUpdate])

    })
    .catch(err => console.log(err))


  }

  const [serverState, setServerState] = useState();
        const handleServerResponse = (ok, msg) => {
          setServerState({ok, msg});
        };
        const handleOnSubmit = (values, {setSubmitting, resetForm}) => {
          // const {name} = values

          api.put(`${props.url}/${props.id}/specs`, {...values})
            .then(response => {

              setSubmitting(false);

              refreshMaterial()
              console.log(values);
              handleServerResponse(true, "");
              //agregar a la data general de la tabla materiales
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
                 ...props.specs
               }}
               validationSchema={props.validationSchema}

               onSubmit={handleOnSubmit}
             >
               {({ values, setFieldValue, submitForm, isSubmitting }) => (
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

                     <props.form />

                     {isSubmitting && <LinearProgress />}
                     <br />



                 {serverState && (
                   <p className={!serverState.ok ? "errorMsg" : ""}>
                     {serverState.msg}
                   </p>
                 )}

                         <Grid item style={{paddingRight: 0}}>
                             <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              disabled={isSubmitting}
                              onClick={submitForm}
                              startIcon={<SaveIcon {...props}/>}
                            >
                              guardar
                            </Button>
                         </Grid>


                        </Grid>
                      </Grid>
               </Form>
               )}

             </Formik>


        )
}

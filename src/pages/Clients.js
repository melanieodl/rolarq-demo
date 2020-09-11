import React from "react"
import {Container, Box} from '@material-ui/core'
import Table from '../components/tables/EditableTb'

const clients = props => {
  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Nombres', field: 'name',
       validate: rowData => ( typeof rowData.name != 'undefined' && rowData.name?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false)},
     { title: 'Dirección', field: 'address'},
     { title: 'Email', field: 'email'},
     { title: 'Télefono', field: 'phoneNumber', width: 150}
   ]

  return (
    <div>
    <Box m={5} />
    <Container fixed maxWidth="lg">
    <Table columns={columns} url='clients' title='Clientes' label='cliente' />
    </Container>
    </div>
  )

}
export default clients

import React from "react"
import {Container} from '@material-ui/core'

import Table from '../components/tables/EditableTb'
import {TextField} from '@material-ui/core'





const clients = props => {
  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Nombre', field: 'name',
     validate: rowData => ( typeof rowData.name != 'undefined'?
                  rowData.name.trim() === '' ? { isValid: false, helperText: 'Nombre es requerido' } : true
                  : false)
   },
     { title: 'Nit', field: 'nit', type: 'numeric'},
     { title: 'Dirección', field: 'address'},
     { title: 'Télefono', field: 'phoneNumber'},
   ]

  return (
    <Container fixed maxWidth="lg">
    <Table columns={columns} url='suppliers' title='Proveedores' label='proveedor' />
    </Container>
  )

}
export default clients

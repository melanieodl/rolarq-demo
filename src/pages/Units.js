import React from "react"
import {Container, Box} from '@material-ui/core'
import Table from '../components/tables/EditableTb'




const clients = props => {
  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Nombre', field: 'name',
       validate: rowData => ( typeof rowData.name != 'undefined'?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false)},
     { title: 'Simbolo', field: 'symbol',
       validate: rowData => ( typeof rowData.symbol != 'undefined'?
                                  rowData.symbol.trim() === '' ?
                                      { isValid: false, helperText: 'Simbolo es requerido' } : true
                                  : false)},
     { title: 'Restricted', field: 'restricted', hidden: true},
   ]

  return (
    <div>
    <Box m={2} />
    <Container fixed maxWidth="lg">
    <Table columns={columns} url='units' title='Unidades de Medida' label='unidad' />
    </Container>
    </div>
  )

}
export default clients

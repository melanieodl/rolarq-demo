import React, {forwardRef, createRef, useState, useEffect} from 'react';
import MaterialTable, {MTableToolbar, MTableBody, MTableHeader} from 'material-table';

import axios from 'axios'


import grey from '@material-ui/core/colors/grey';

import {Paper} from '@material-ui/core'
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

import Add from '@material-ui/icons/Add'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterListRounded';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Refresh from '@material-ui/icons/RefreshRounded';


const tableIcons = {
    Add: forwardRef((props, ref) => <Fab color="secondary" size="medium"><Add {...props} ref={ref} /> </Fab>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Refresh: forwardRef((props, ref) => <Refresh color="primary"{...props} ref={ref} />)
  };

  const api = axios.create({
    baseURL: `http://localhost:8080/api/`
  })

export default function EditableTb(props) {
  const tableRef = createRef()



  const [data, setData] = useState([])
  const [units, setUnits] = useState({})

  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false)

  const columns = [
     { title: 'Id', field: 'id'},
     { title: 'Nombre', field: 'name' },
     { title: 'Unidad', field: 'unit.id', lookup: units},
     { title: 'Restricted', field: 'restricted', hidden: true},
   ]

  useEffect(() => {

    api.get('units/catal')
    .then(response => {
      setUnits(response.data)

    })
    .catch(err => {
      setErrorMessages(['Cannot load user data'])
      setIsError(true)
    })
    api.get(props.url)
    .then(response => {
      setData(response.data)
    })
    .catch(err => {
      setErrorMessages(['Cannot load user data'])
      setIsError(true)
    })

  }, [refreshFlag])


  const handleRowAdd = (newData, resolve) => {

    //validation
    let errorList = []
    //if(dato indefinido then errorList.push())

    if(errorList.length < 1){
      api.post(props.url, newData)
      // console.log(url + newData)
      .then(res => {
        let dataToAdd = [...data]
        dataToAdd.push(newData)
        setData(dataToAdd)
        resolve()
        setErrorMessages([])
        setIsError(false)
      })
      .catch(err => {
        setErrorMessages(["Cannot add data. Server error!"])
        setIsError(true)
        resolve()
      })
    } else {
      setErrorMessages(errorList)
      setIsError(true)
      resolve()
    }

  }

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = []

    if(errorList.length < 1){
      api.put(`${props.url}/${newData.id}`, newData)
      .then(res => {
        const dataUpdate = [...data]
        const index = oldData.tableData.id
        dataUpdate[index] = newData
        setData([...dataUpdate])
        resolve()
        setIsError(false)
        setErrorMessages([])
      })
      .catch(err => {
        setErrorMessages(["update failed! Server error"])
        setIsError(true)
        resolve()
      })
    } else {
      setErrorMessages(errorList)
      setIsError(true)
      resolve()
    }
  }

  const handleRowDelete = (oldData, resolve) => {
    let errorList = []

    api.delete(`${props.url}/${oldData.id}`)
    .then(res => {
      const dataDelete = [...data]
      const index = oldData.tableData.id
      dataDelete.splice(index, 1)
      setData([...dataDelete])
      resolve()
    })
    .catch(err => {
      setErrorMessages(["Delete failed! Server error"])
      setIsError(true)
      resolve()
    })
  }
  return (
    <MaterialTable
      tableRef={tableRef}
      icons={tableIcons}
      title={props.title}
      columns={columns}
      data={data}
      editable={{
        isEditable: rowData => !rowData.restricted, // only name(a) rows would be editable
        isDeletable: rowData => !rowData.restricted, // only name(b) rows would be deletable,

        onRowAdd: (newData) =>
          new Promise((resolve) => {
            handleRowAdd(newData, resolve)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            handleRowUpdate(newData, oldData, resolve)
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            handleRowDelete(oldData, resolve)
          }),
      }}
      options={{
       actionsColumnIndex: -1,
       // filtering: true,
       // searchFieldAlignment: 'left',
       selection: true,
       sorting: true,
       pageSize: 10,
       pageSizeOptions: [10],
       paginationType: 'normal',
       padding: 'dense',
       headerStyle: {
         paddingTop: 0,
         paddingBottom: 0,
         fontSize: '0.75rem',
         color: grey[800],
         backgroundColor: grey[100],
         borderTopLeftRadius: 2,
         borderTopRightRadius: 2,
       },
       cellStyle: {
         paddingTop: 10,
         paddingBottom: 10,
       }

     }}
     actions={[
       {
         icon: tableIcons.Refresh,
         tooltip: 'Actualizar',
         isFreeAction: true,
         onClick: () => {
              setRefreshFlag((flag)=>!flag)
            },
       }
     ]}
     components={{
       Toolbar: props => (
          <div style={{backgroundColor: '#e4e5eb'}}>

            <MTableToolbar {...props} />
          </div>
        ),
        Container: props => (
          <Paper  elevation={0} {...props}>{props.children}</Paper>
        ),

        // Body: props => (
        //   <div style={{width: '100%'}}><Paper><MTableBody {...props} /></Paper></div>
        // ),

     }}
     localization={{
       toolbar: {
         searchTooltip: `Buscar ${props.label}`,
         searchPlaceholder: `Buscar ${props.label}`,
       },
       header: {
         actions: 'Acciones',
       },
       body: {
         addTooltip: `Nuevo ${props.label}`,
         deleteTooltip: 'Eliminar',
         editTooltip: 'Editar',
         editRow: {
           deleteText: 'Esta seguro de eliminar este dato?',
           cancelTooltip: 'Cancelar',
           saveTooltip: 'Guardar',
         }
       },
       pagination: {
         firstTooltip: 'Primera pagina',
         previousTooltip: 'Pagina Anterior',
         nextTooltip: 'Pagina Siguiente',
         lastTooltip: 'Ultima pagina',
         labelDisplayedRows: '{from}-{to} de {count}'        }
     }}
    />
  );
}

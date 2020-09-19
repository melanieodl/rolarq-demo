import React, {forwardRef, createRef, useState, useEffect} from 'react';
import api from '../../api'
import localization from './localization'
import MaterialTable, {MTableToolbar} from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import {Paper, Fab} from '@material-ui/core'
import {Add, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear,
        DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt,
        Search, ViewColumn, Refresh} from '@material-ui/icons'


const tableIcons = {
    Add: () => (<Fab color="secondary" size="medium"><Add /> </Fab>),
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


  const useStyles = makeStyles((theme) => ({
    actionsContainer: {
      minWidth: "max-content",
      marginLeft: theme.spacing(2)

    },
    searchField: {
      maxWidth: "max-content",
    },
  }));

export default function EditableTb(props) {
  const classes = useStyles()
  const tableRef = createRef()
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false)

  useEffect(() => {

    props.lookupEffects && props.lookupEffects.forEach(effect => effect())
    setLoading(true)
    api.get(props.url)
    .then(response => {
      console.log('consola aqui' + response.data)
      setData(response.data)
      setLoading(false)
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
        console.log('respuesta al guardar', res.data);

        let dataToAdd = [...data]
        dataToAdd.unshift(res.data)
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
      columns={props.columns}
      data={data}
      isLoading={isLoading}
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
      detailPanel={props.panels}
      options={{
       actionsColumnIndex: -1,
       addRowPosition: 'first',
       // filtering: true,
       // searchFieldAlignment: 'left',
       // selection: true,
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
         paddingTop: 12,
         paddingBottom: 12
       },


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
            <MTableToolbar classes={{ actions: classes.actionsContainer, searchField: classes.searchField }} {...props}>
            </MTableToolbar>
          </div>
        ),
        Container: props => (
          <Paper  elevation={0} {...props}>{props.children}</Paper>
        ),

        // Body: props => (
        //   <div style={{width: '100%'}}><Paper><MTableBody {...props} /></Paper></div>
        // ),

     }}
     localization={localization(props.label)}
    />
  );
}

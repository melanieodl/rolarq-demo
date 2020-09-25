import React, {forwardRef, createRef, useState, useEffect} from 'react';
import MaterialTable from 'material-table';


import api from '../../../api.js'
import localization from '../localization'

import grey from '@material-ui/core/colors/grey';

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';


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

const AddPrice = (props, ref) => {
  return(
  <Button
     variant="text"
     color="secondary"
     size="small"
     startIcon={<AddBox {...props} ref={ref}/>}
   >
     Agregar Precio
   </Button>
 )
}

const tableIcons = {
    Add: forwardRef(AddPrice),
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
  };


const DetailTitle = title => <Typography color='textPrimary' variant='body2'>{title}</Typography>


export default function EditableTb(props) {
  const tableRef = createRef()
  const [data, setData] = useState([])
  const [suppliers, setSuppliers] = useState({})


  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  const columns = [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Especial', field: 'special', type: 'boolean', width:'10%' },
     { title: 'Precio', field: 'price', type: 'currency',
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2},
       validate: rowData => ( typeof rowData.price != 'undefined'?
                                  rowData.price.length <= 0 ?
                                      { isValid: false, helperText: 'Precio es requerido' } : true
                                  : false),
       width: '30%'},
     { title: 'Proveedor', field: 'supplier.id', lookup: suppliers, width: '60%'},
   ]

  useEffect(() => {
      api.get('suppliers/catal')
      .then(res => {
        setSuppliers(res.data)

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

  }, [])


  const handleRowAdd = (newData, resolve) => {

    //validation
    let errorList = []
    //if(dato indefinido then errorList.push())

    if(errorList.length < 1){
      api.post(props.url, newData)
      // console.log(url + newData)
      .then(res => {
        let dataToAdd = [...data]
        dataToAdd.push(res.data)
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
      title={DetailTitle(props.title)}
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
       addRowPosition: 'first',
       search: false,
       paging: false,
       pageSize: 5,
       pageSizeOptions: [5],
       padding: 'dense',
       // headerStyle: {
       //   paddingTop: 0,
       //   paddingBottom: 0,
       //   fontSize: '0.75rem',
       //   color: grey[800],
       //   borderTopLeftRadius: 2,
       //   borderTopRightRadius: 2,
       // },
       headerStyle: {
         paddingTop: 0,
         paddingBottom: 0,
         fontSize: '0.75rem',
         color: grey[800],
         borderTopLeftRadius: 2,
         borderTopRightRadius: 2,
         // borderBottom: `solid 2px #26a69a`,

       },
       cellStyle: {
         paddingTop: 8,
         paddingBottom: 8,
       },



     }}

     components={{
        Container: props => (
          <div {...props}>{props.children}</div>
        ),

        // Body: props => (
        //   <div style={{width: '100%'}}><Paper><MTableBody {...props} /></Paper></div>
        // ),

     }}
     localization={localization(props.label)}
    />

  );
}

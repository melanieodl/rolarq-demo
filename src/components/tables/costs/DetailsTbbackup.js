import React, {forwardRef, createRef, useState, useEffect, Fragment} from 'react';
import MaterialTable, {MTableHeader} from 'material-table';

import api from '../../../api'
import localization from '../localization'
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableRow, TableCell} from '@material-ui/core';

import grey from '@material-ui/core/colors/grey';

import {Button, Box, Typography} from '@material-ui/core'


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

const useStyles = makeStyles((theme) => ({
  tableTotal: {
    maxWidth: 400,
    marginLeft: 'auto',
    // float: 'right',
  },
  totalCell: {
    paddingRight: 95,
  },
}));


const DetailTitle = title => <Typography variant='subtitle1'>{title}</Typography>

const DetailsTb = ({title, label, color, total, rowUrl, url}) => {
// refreshRow, rowData, tableRef, columns,
  const AddPrice = (ref, props) => {
    return(
    <Button
       variant="contained"
       color="primary"
       size="small"
       startIcon={<AddBox {...props} ref={ref}/>}
     >
       {title}
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

  const [isLoading, setLoading] = useState(false)

  const classes = useStyles()
  const [data, setData] = useState([])

  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])


  useEffect(() => {
    setLoading(true)

    api.get(url)
    .then(response => {
      setData(response.data)
      setLoading(false)
    })
    .catch(err => {
      setErrorMessages(['Cannot load user data'])
      setIsError(true)
      setLoading(false)

    })

  }, [total])


  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    //if(dato indefinido then errorList.push())
    if(errorList.length < 1){
      api.post(url, newData)
      .then(res => {
        let dataToAdd = [...data]
        dataToAdd.push(res.data)

        setData(dataToAdd)
        // refreshRow(rowUrl, rowData)

        setErrorMessages([])
        setIsError(false)
        resolve()

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
      console.log(newData);

      api.put(`${url}/${newData.id}`, newData)
      .then(res => {

        const dataUpdate = [...data]
        const index = oldData.tableData.id

        dataUpdate[index] = {...res.data, tableData: {...oldData.tableData}}
        setData([...dataUpdate])
        // refreshRow(rowUrl, rowData)

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

    api.delete(`${url}/${oldData.id}`)
    .then(res => {

      const dataDelete = [...data]
      const index = oldData.tableData.id
      dataDelete.splice(index, 1)
      setData([...dataDelete])
      // refreshRow(rowUrl, rowData)

      resolve()
    })
    .catch(err => {
      setErrorMessages(["Delete failed! Server error"])
      setIsError(true)
      resolve()
    })
  }
  return (
    <Fragment>
    <MaterialTable
      icons={tableIcons}
      title={DetailTitle(title)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      editable={{
        // isEditable: rowData => !rowData.generated, // only name(a) rows would be editable
        isDeletable: rowData => !rowData.generated, // only name(b) rows would be deletable,
        isEditable: rowData => rowData.type != 5 , // only name(b) rows would be deletable,


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
       // loadingType:'linear',

       // addRowPosition: 'first',
       search: false,
       paging: false,
       pageSize: 5,
       pageSizeOptions: [5],
       padding: 'dense',
       headerStyle: {
         paddingTop: 0,
         paddingBottom: 0,
         fontSize: '0.75rem',
         color: grey[800],
         borderTopLeftRadius: 2,
         borderTopRightRadius: 2,
         borderBottom: `solid 2px ${color}`,

       },
       cellStyle: {
         paddingTop: 8,
         paddingBottom: 8,
       },
       // tableLayout: 'fixed',
     }}

     components={{
        Container: props => (
          <div {...props}>{props.children}</div>
        ),
     }}
     localization={localization(label)}
    />

    <Table  aria-label="spanning table" className={classes.tableTotal}>
        <TableBody>
            <TableRow>
               <TableCell rowSpan={1} />
               <TableCell colSpan={2}>SubTotal</TableCell>
               <TableCell className={classes.totalCell} align="right">{ new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(total || 0)}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    </Fragment>

  );
}

export default React.memo(DetailsTb)

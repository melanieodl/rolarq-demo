import React, {forwardRef, createRef, useState, useEffect, useMemo, Fragment} from 'react';
import api from '../../api'
import XLSX from 'sheetjs-style'
import {summaryWS, materialsWS, budgetWS} from '../../report'
import localization from './localization'
import MaterialTable, {MTableToolbar} from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import updateForms from '../rows_forms/info/forms_map'

import {Paper, Fab, List, ListItem, ListItemText, Typography, Divider, Grid,
        Avatar, ListItemAvatar} from '@material-ui/core';
import {Add, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear,
        DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt,
        Search, ViewColumn, Refresh} from '@material-ui/icons'
import CostTb from './CostTb'


import MenuDial from './partials/MenuDial'

import ConfirmationDialog from '../partials/ConfirmationDialog'
import ExportDialog from '../partials/ExportDialog'

import {SoleraForm, ZapataForm, ColumnaForm, ColumnaEspecialForm,
        CimientoForm, LosaPlanaForm, LosaInclinadaForm,
        RepelloCernidoForm, MuroForm,
        MezclonConcretoForm, MezclonMorteroForm, MezclonExtForm,
        PinturaForm} from '../rows_forms/createForms'

import {toCurrency} from '../../functions'


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
    Refresh: forwardRef((props, ref) => <Refresh color="primary"{...props} ref={ref} />),
    AddLibrary:  forwardRef((props, ref) => <MenuDial {...props} ref={ref}/>)

  };

  const actions = [
    { name: 'Zapata', form: ZapataForm },
    { name: 'Cimiento Corrido', form: CimientoForm },
    { name: 'Solera', form: SoleraForm },
    { name: 'Columna', form: ColumnaForm },
    { name: 'Columna Especial', form: ColumnaEspecialForm },
    { name: 'Losa Plana', form: LosaPlanaForm },
    { name: 'Losa Inclinada', form: LosaInclinadaForm },
    { name: 'Muro', form: MuroForm },
    { name: 'Mezclón Mortero', form: MezclonMorteroForm },
    { name: 'Mezclón Concreto', form: MezclonConcretoForm },
    { name: 'Mezclón Garage y Banquetas', form: MezclonExtForm },
    { name: 'Repello y Cernido', form: RepelloCernidoForm },
    { name: 'Pintura', form: PinturaForm },



  ];


  const useStyles = makeStyles((theme) => ({
    actionsContainer: {
      minWidth: "max-content",
      marginLeft: theme.spacing(2)

    },
    searchField: {
      maxWidth: "max-content",
    },
    panel: {
      paddingLeft: theme.spacing(11),
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(2)
    },

  }));

const rowForDelete = (row, idx) => {
  const DetailTypo = ({showMsg}) => {
    const classes = useStyles()
    return (
      <Typography
        component="span"
        variant="body2"
        className={classes.inline}
        color="textPrimary"
      >
        {showMsg()}
      </Typography>
    )

  }
  return (
  <ListItem>
  <ListItemAvatar>
    <Avatar>
      {idx + 1}
    </Avatar>
  </ListItemAvatar>
    <ListItemText primary={row.name} secondary={
      <Grid container direction="row"
            justify="flex-start"
            spacing={1}
            alignItems="center">
            <Grid item>
              {' Cantidad: '}
              <DetailTypo showMsg={() => row.unitAmount ? row.unitAmount : 0} />
            </Grid>
            <Divider orientation="vertical" light flexItem variant='middle'/>
            <Grid item>
              {' Precio Unitario: '}
              <DetailTypo showMsg={() => toCurrency(row.unitCost ? row.unitCost : 0)} />
            </Grid>
            <Divider orientation="vertical" light flexItem variant='middle'/>
            <Grid item>
              {' Precio Total: '}
               <DetailTypo showMsg={() => toCurrency(row.totalCost ? row.totalCost : 0)} />
            </Grid>

      </Grid>
    }
    />
    <Divider />
  </ListItem>
)
}

export default function EditableTb(props) {
  const classes = useStyles()
  const tableRef = createRef()
  const [isLoading, setLoading] = useState(true)

  //edit handling for special rowS
  const [open, setOpen] = useState(false);
  const [updateDialog, setUpdateDialog] = React.useState({active: Fragment})

  const handleOpenModal = (form, rowData) => {
    setUpdateDialog({active: form, data: rowData})
    setOpen(true)
  }

   const handleCloseModal = () => {
    setOpen(false);
   };



  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false)

  //confirmation dialog infomation
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState([])
  const onConfirm = async (data) => {
    await Promise.all(
      data.map( async row => {
            try {
                console.log('borrada' , row.id);
                return await api.delete(`${props.url}/${row.id}`)

            } catch (err) {
              console.log(err);
            }
      })
    )

      let _data = [...props.data];
      data.forEach(rd => {
        _data = _data.filter(t => t.tableData.id !== rd.tableData.id);
      });
      props.setData(_data);

      }
  const handleClose = () => {
      setConfirmOpen(false)
  }

  //export to excel information
  const [exportOpen, setExportOpen] = useState(false)
  const [reportData, setReportData] = useState([])
  const onExport = async (data, fileName) => {
    // A workbook is the name given to an Excel file
     var wb = XLSX.utils.book_new() // make Workbook of Excel
     // add Worksheet to Workbook
     // Workbook contains one or more worksheets
     XLSX.utils.book_append_sheet(wb, summaryWS(data), 'RESUMEN DE PRESUPUESTO')
     XLSX.utils.book_append_sheet(wb, await materialsWS(data), 'LISTADO DE MATERIALES')
     XLSX.utils.book_append_sheet(wb, await budgetWS(data), 'PRESUPUESTO DESGLOSADO')

     // export Excel file
     XLSX.writeFile(wb, `${fileName}.xlsx`) // name of the file is 'book.xlsx'
  }
  const handleReportCancel = () => setExportOpen(false)

  useEffect(() => {

    props.lookupEffects && props.lookupEffects.forEach(effect => effect())
    setLoading(true)
    api.get(props.url)
    .then(response => {
      console.log('consola aqui' + response.data)
      props.setData(response.data)
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
        let dataToAdd = [...props.data]
        dataToAdd.unshift(res.data)
        props.setData(dataToAdd)
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
    console.log('newData', oldData);

    if(errorList.length < 1){
      api.put(`${props.url}/${newData.id}`, newData)
      .then(res => {
        const dataUpdate = [...props.data]
        const index = oldData.tableData.id
        dataUpdate[index] = {...res.data, tableData: oldData.tableData}
        props.setData([...dataUpdate])
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
      const dataDelete = [...props.data]
      const index = oldData.tableData.id
      console.log('tableData.id', index);

      dataDelete.splice(index, 1)
      console.log('data', dataDelete);

      props.setData([...dataDelete])

      resolve('terminado')
    })
    .catch(err => {
      setErrorMessages(["Delete failed! Server error"])
      setIsError(true)
      resolve()
    })
  }


  const handleDeleteRows = async oldData => {

    return new Promise((resolve) => {
      handleRowDelete(oldData, resolve)
    })
    // try {
    //     const dataDelete = [...props.data]
    //     const index = oldData.tableData.id
    //     dataDelete.splice(index, 1)
    //     const res = await api.delete(`${props.url}/${oldData.id}`)
    //     await props.setData([...dataDelete])
    //   return await res.data
    // } catch (err) {
    //   console.log(err);
    // }

  }

  return (
    <Fragment>
    <MaterialTable
      tableRef={tableRef}
      icons={tableIcons}
      title={props.title}
      columns={props.columns}
      data={props.data}
      isLoading={isLoading}
      editable={{
        isEditHidden: rowData => true,
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
      detailPanel={rowData => {
        var idRow = rowData.id
        // const refreshRow = () => {
        //   api.get(`budgets/${props.rowData.budget.id}/rows/${props.rowData.id}`)
        //   .then(res => {
        //     const dataUpdate = [...props.rowsData]
        //     const index = props.rowData.tableData.id
        //     const updatedRow = {...res.data, tableData: props.rowData.tableData}
        //     dataUpdate[index] = updatedRow
        //     props.setRowsData([...dataUpdate])
        //     console.log('ACTUALIZA ROW AQUI');
        //
        //     props.setReload(prev => !prev)
        //   })
        //   .catch(err => console.log(err))
        //
        //
        // }

        return (
          <div className={classes.panel}>
          <CostTb setReload={props.setReload} rowsData={props.data} setRowsData={props.setData} url={`rows/${idRow}`}
                                idRow={idRow} rowData={rowData} units={props.units} options={props.options} />
          </div>
        )
      }}
      options={{
       actionsColumnIndex: -1,
       addRowPosition: 'first',
       paging: false,
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
       rowStyle: {
         // backgroundColor: '#EDF4F5',
         // backgroundColor: '',
         // borderBottom: 'solid 2px #e0f2f1',
         // borderTop: 'solid 2px #e0f2f1',

       },
       cellStyle: {
         paddingTop: 12,
         paddingBottom: 12
       },


     }}

     actions={[
       {
          icon: tableIcons.Edit,
          tooltip: 'Editar',
          onClick: (event, rowData) => {
            if(rowData.type){
              handleOpenModal(updateForms[rowData.type.id], rowData)
            } else {
                tableRef.current.dataManager.changeRowEditing(rowData, 'update');
                tableRef.current.setState({
                  ...tableRef.current.dataManager.getRenderState(),
                });
            }

          },
          position: 'row'
        },


       {
         tooltip: 'Exportar a Excel',
         icon: tableIcons.Export,
         onClick: (evt, data) => {setReportData(data); setExportOpen(true);}
        },

         {
          tooltip: 'Eliminar renglones seleccionados',
          icon: tableIcons.Delete,
          onClick: (evt, data) => {setConfirmData(data); setConfirmOpen(true);}

        },


       {
         icon: tableIcons.Refresh,
         tooltip: 'Actualizar',
         isFreeAction: true,
         onClick: () => {
              setRefreshFlag((flag)=>!flag)
            },
       },
       {
         icon: () => <tableIcons.AddLibrary setData={props.setData} actions={actions} budgetId={props.budgetId}/>,
         isFreeAction: true,
         // iconProps: {style: {padding: 0}},
       },
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
    <ConfirmationDialog
          classes={{
            paper: classes.paper,
          }}
          id="rows-to-delete"
          keepMounted
          showTitle = {data => `¿Esta seguro de eliminar ${data.length > 1 ? `estos ${data.length} renglones?` : `este renglón ?`}`}
          showRow ={rowForDelete}
          open={confirmOpen}
          onClose={handleClose}
          data={confirmData}
          onConfirm={onConfirm}
      />
      <ExportDialog
            classes={{
              paper: classes.paper,
            }}
            id="download-report"
            keepMounted
            showTitle = {() => `EXPORTAR A EXCEL`}
            open={exportOpen}
            onClose={handleReportCancel}
            data={reportData}
            onConfirm={onExport}
        />

        <updateDialog.active closeModal={handleCloseModal} open={open}
        rowData={updateDialog.data} rowsData={props.data} setRowsData={props.setData}
        />

    </Fragment>
  );
}

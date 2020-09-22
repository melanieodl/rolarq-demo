import React, {forwardRef, createRef, useState, useEffect, Fragment} from 'react';
import api from '../../api'
import localization from './localization'

import { makeStyles } from '@material-ui/core/styles';

import MaterialTable, {MTableToolbar} from 'material-table';
import grey from '@material-ui/core/colors/grey';
import {Select, MenuItem, FormControl, Paper, Fab, Divider, Typography,
        ListItemText, Grid, ListItem, ListItemAvatar, Avatar} from '@material-ui/core';
import {Add, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline,
        Edit, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn} from '@material-ui/icons'
import FilterList from '@material-ui/icons/FilterListRounded';
import Refresh from '@material-ui/icons/RefreshRounded';
import Price from '@material-ui/icons/AttachMoneyRounded';
import ExpandLess from '@material-ui/icons/ExpandLessRounded';

import DetailsTb from './partials/MaterialPricesTb'

import MenuDial from './partials/MenuDial'
import ConfirmationDialog from '../partials/ConfirmationDialog'

import {CementForm, SandForm, GravelForm,
        IronForm, TieWireForm, BlockForm, CoverPreMixForm,
        PaintForm, ElectromallaForm} from '../materials_forms/createForms'

import formsMap from '../materials_forms/forms_map'
import {toCurrency} from '../../functions'

const tableIcons = {
    Add: forwardRef((props, ref) => <Fab  color="secondary" size="medium"><Add {...props} ref={ref} /> </Fab> ),
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
    // AddLibrary: forwardRef((props, ref) => <Fab color="primary" size="medium"><AddLibrary {...props} ref={ref} /> </Fab>),
    AddLibrary:  forwardRef((props, ref) => <MenuDial {...props} ref={ref}/>),
    Price: forwardRef((props, ref) => <Price {...props} ref={ref} />),
  };

  const useStyles = makeStyles((theme) => ({
    actionsContainer: {
      minWidth: "max-content",
      marginLeft: theme.spacing(2)

    },
    searchField: {
      maxWidth: "max-content",
    },
    panel: {
      paddingLeft: theme.spacing(12.5),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4)
    }

  }));

  const materialForDelete = (row, idx) => {

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
                {`${row.type ? `${row.type.name}, `: ''} ${row.unit.name}`}
              </Grid>
        </Grid>
      }
      />
      <Divider />
    </ListItem>
  )
  }


export default function MaterialsTb(props) {
  const classes = useStyles();

  const tableRef = createRef()
  const [isLoading, setLoading] = useState(true)
  const [refreshFlag, setRefreshFlag] = useState(false)

  const [data, setData] = useState([])
  const [units, setUnits] = useState({})
  const [types, setTypes] = useState({})

  //error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState([])
  const onConfirm = async (materials) => {
    await Promise.all(
      materials.map( async row => {
            try {
                console.log('borrada' , row.id);
                return await api.delete(`${props.url}/${row.id}`)

            } catch (err) {
              console.log(err);
            }
      })
    )

      let _data = [...data];
      materials.forEach(rd => {
        _data = _data.filter(t => t.tableData.id !== rd.tableData.id);
      });
      setData(_data);

      }
  const handleClose = () => {
      setConfirmOpen(false)
  }

  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Nombre', field: 'name', filtering: false, render: rowData => rowData.fullName,
       validate: rowData => ( typeof rowData.name != 'undefined'?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false)},
     { title: 'Tipo', field: 'type.id', editable:'never', lookup: types},
     { title: 'Unidad de Medida', field: 'unit.id', lookup: units,
       validate: rowData => ( typeof rowData.unit != 'undefined'),
       editComponent: props => {
            return (
              <FormControl>

              <Select
                 value={props.value}
                 displayEmpty
                 disabled = {props.rowData.type != null}
                 onChange={e => props.onChange(e.target.value)}

               >
                 {Object.entries(units).map(([key, value]) => (
                   <MenuItem value={key}>
                     {value}
                   </MenuItem>
                 ))}
               </Select>
              </FormControl>
            )
          }
      },
     { title: 'Specs', field: 'specifications.data', hidden: true},

   ]

   const actions = [
     { name: 'Cemento', form: CementForm},
     { name: 'Arena', form: SandForm  },
     { name: 'Piedrin', form: GravelForm  },
     { name: 'Hierro', form: IronForm  },
     { name: 'Alambre de Amarre', form: TieWireForm },
     { name: 'Block', form: BlockForm  },
     { name: 'Recubrimiento Premezclado', form: CoverPreMixForm  },
     { name: 'Pintura', form: PaintForm},
     { name: 'Electromalla', form: ElectromallaForm},


   ];

  //units catalog
  useEffect(() => {
    api.get('units/catal')
    .then(response => {
      setUnits(response.data)
    })
    .catch(err => {
      setErrorMessages(['Cannot load user data'])
      setIsError(true)
    })
  }, [refreshFlag])


  //materials type catalog
  useEffect(() => {
      api.get('materialtypes/catal')
      .then(response => {
        setTypes(response.data)
      })
      .catch(err => {
        setErrorMessages(['Cannot load user data'])
        setIsError(true)
      })
  }, [refreshFlag])

  //loading data when mounted and refresh
  useEffect(() => {
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
        // let dataToAdd = [res.data, ...data]
        console.log('Material de respuesta', res.data);
        setData(data => [ res.data, ...data])
        console.log(data);
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
        dataUpdate[index] = res.data
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
    <Fragment>
    <MaterialTable
      tableRef={tableRef}
      icons={tableIcons}
      title={props.title}
      columns={columns}
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
      detailPanel={[
        rowData => ({
        tooltip: 'Detalles',
        render: rowData => {
          const Form = rowData.type ? formsMap[rowData.type.id] ? formsMap[rowData.type.id] : null : null
        return (
          <div
            className={classes.panel}
          >

          {rowData.specifications != null && Object.keys(rowData.specifications).length != 0 &&
            (<Fragment>
                <br/>
                <Typography color='primary' variant='body2'>Especificaciones</Typography>
                <br/>
                <Form id={rowData.id} specs={rowData.specifications} materialData={rowData}
                tableData={rowData.tableData} materialsData={data} setMaterialsData={setData}
                apiId={props.url} />
                <br/>
                <Divider/>
                <br/>
            </Fragment>)
          }


          <DetailsTb url={`/materials/${rowData.id}/prices`} parentId={rowData.id}
          title='Precios' label="precio"
          />


          </div>
        )
      }}),

    ]}
      options={{
       actionsColumnIndex: -1,
       filtering: true,
       searchFieldAlignment: 'right',
       addRowPosition: 'first',
       selection: true,
       sorting: true,
       pageSize: 10,
       pageSizeOptions: [10],
       paginationType: 'normal',
       padding: 'dense',
       headerStyle: {
         paddingTop: 8,
         paddingBottom: 8,
         fontSize: '0.75rem',
         color: grey[900],
         backgroundColor: grey[100],
         borderTopLeftRadius: 2,
         borderTopRightRadius: 2,
       },
       rowStyle: {
         // backgroundColor: '#EDF4F5',
         // // backgroundColor: '',
         // borderBottom: 'solid 2px #e0f2f1',
         // borderTop: 'solid 2px #e0f2f1',

       },
       cellStyle: {
         paddingTop: 10,
         paddingBottom: 10
       },
       searchFieldStyle: {
         maxWidth: 'max-content',

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
       },
       {
        tooltip: 'Eliminar materiales',
        icon: tableIcons.Delete,
        onClick: (evt, data) => {setConfirmData(data); setConfirmOpen(true);}


      },
       {
         icon: () => <tableIcons.AddLibrary setData={setData} actions={actions}/>,
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
          showTitle = {data => `¿Esta seguro de eliminar ${data.length > 1 ? `estos ${data.length} materiales?` : `este material ?`}`}
          showRow ={materialForDelete}
          open={confirmOpen}
          onClose={handleClose}
          data={confirmData}
          onConfirm={onConfirm}
      />
      </Fragment>
  );
}

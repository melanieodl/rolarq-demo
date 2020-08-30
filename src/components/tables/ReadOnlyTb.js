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


  const useStyles = makeStyles((theme) => ({
    actionsContainer: {
      minWidth: "max-content",
      marginLeft: theme.spacing(2)

    },
    searchField: {
      maxWidth: "max-content",
    },
  }));

const ReadOnlyTb = (props) => {
  const classes = useStyles()
  const tableRef = createRef()
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {

    setLoading(true)
    api.get(`${props.url}`)
    .then(response => {
      console.log('consola aqui' + response.data)
      setData(response.data)
      setLoading(false)
    })
    .catch(err => {

    })

  }, [])
  return(
    <MaterialTable
      tableRef={tableRef}
      title= {props.title}
      columns={props.columns}
      data={data}
      icons={tableIcons}
      isLoading={isLoading}
      options={{
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
     localization={localization(props.label

     )}

   />
  )
}

export default ReadOnlyTb

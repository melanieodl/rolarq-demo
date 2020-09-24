import React, {useState, useEffect, createRef, useRef, useCallback, useMemo, Fragment} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import api from '../api'

import {Button, Dialog, ListItemText, ListItem, List, Divider, AppBar, Toolbar,
        IconButton, Typography, Slide, Grid, Paper, TextField, Container,
        FormControl, Select, MenuItem, Box,Tooltip} from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import CloseIcon from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLessRounded';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import EditTable from '../components/tables/RowsTb'
import SpeedDial from '../components/tables/partials/SpeedDial'
import CostTb from '../components/tables/CostTb'

const useStyles = makeStyles((theme) => ({
  appBar: {
    // position: 'fixed',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  listItem: {
    minHeight: 72
  },
  panel: {
    paddingLeft: theme.spacing(11),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2)
  },
  projectData: {
    backgroundColor: '#fff',
  },
  backTb: {
    backgroundColor: '#e4e5eb'
  },

  totalTitle: {
    borderBottom: 'solid 2px #4a9b9f'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  arrow: {
    color: theme.palette.common.black,
  },
}))(Tooltip);

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}




export default function FullScreenDialog(props) {

  const classes = useStyles();
  const [data, setData] = useState([])
  const [total, setTotal] = useState()
  const [reload, setReload] = useState(false)

  const [budget, setBudget] = useState({project: {client: {}}});
  const [units, setUnits] =  useState({});
  const [materials, setMaterials] = useState({})


  const options = [{"id":97,"name":"Arena","unit":{"id":4,"name":"Metros cúbicos","symbol":"m3","restricted":true},"prices":[]},{"id":123,"name":"Cemento ","unit":{"id":5,"name":"Saco","symbol":"SACO","restricted":true},"prices":[]},{"id":142,"name":"Hierro ","unit":{"id":8,"name":"Varilla","symbol":"VARILLA","restricted":true},"prices":[]},{"id":99,"name":"Piedrin","unit":{"id":4,"name":"Metros cúbicos","symbol":"m3","restricted":true},"prices":[]},{"id":106,"name":"TieWire","unit":{"id":7,"name":"Libra","symbol":"Lb","restricted":true},"prices":[{"id":3,"special":true,"price":40.0,"supplier":{"id":1,"name":"Ferreteria ","nit":56362636,"address":"Barrio tal ","phoneNumber":"33234234"}},{"id":5,"special":true,"price":345.9349,"supplier":null}]},{"id":146,"name":"Block","unit":{"id":1,"name":"Unidad","symbol":"UNIDAD","restricted":true},"prices":[]},{"id":147,"name":"crestuco","unit":{"id":6,"name":"Bolsa","symbol":"BOLSA","restricted":true},"prices":[]}]


  const unitsEffect = () => {
    api.get('units/catal')
    .then(response => {
      setUnits(response.data)
    })
    .catch(err => {
      console.log(err)
    })
  }



  useEffect(() => {
    api.get(`budgets/${props.id}`)
    .then(response => {
      console.log(response.data)
      setBudget(response.data)
      setTotal(response.data.totalCosts)
    })
    .catch(err => {

    })
  }, [props.open])



  useEffect(() => {
    api.get(`budgets/${props.id}`)
    .then(response => {
      setTotal(response.data.totalCosts)
    })
    .catch(err => {

    })

  }, [reload])

  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { width: '1%',  align: 'left', sorting: false, render: (rowData) =>  typeof rowData != 'undefined' && rowData.type &&
              <LightTooltip title={rowData.type.name} placement="bottom">
                <IconButton  size='small' aria-label="upload picture" component="span">
                  <InfoIcon />
                </IconButton>
              </LightTooltip>},
     { title: 'Nombre', field: 'name', width: '40%', render: rowData => rowData.fullName},
     { title: 'Cantidad', field: 'unitAmount', type: 'numeric', width: '15%', align: 'right'},
     { title: 'Unidad', field: 'unit.id', lookup: units, width: '15%', align: 'right',
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
     { title: 'Precio Unitario', field: 'unitCost', type: 'currency', editable: 'never', width: '15%', align: 'right',

       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}},
     { title: 'Precio Total', field: 'totalCost', type: 'currency', editable: 'never', width: '15%', align: 'right',
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}}

   ]





   const panels = [
       rowData =>({
         openIcon: ExpandLess,
         tooltip: 'Presupuestos',
        render: rowData => {
            var row = rowData
            return (
              <div className={classes.panel}>
                {/* enviar los componentes desde aqui con sus refs*/}
                <CostTb setReload={setReload} rowsData={data} setRowsData={setData} url={`rows/${rowData.id}`} rowData={rowData} units= {units} options={options} />
              </div>
            )
          },
       }),
    ]

  const checkPrimaryData = data => typeof data == undefined || data == null ? '               ' : data

  return (
    <div className={classes.backTb}>

      <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition} className={classes.backTb}
      PaperProps={{classes: {root: classes.backTb}}}>
      <HideOnScroll {...props}>

        <AppBar position='fixed'>
          <Toolbar >

            <Typography variant="h6" className={classes.title}>
              { `Presupuesto  ${budget.name}:     ${budget.project.name}`}
            </Typography>
            <Box mr={2}>
            <Typography className={classes.totalTitle}variant="h6" >{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'gtq' }).format(total ? total: 0)} </Typography>
            </Box>
            <IconButton edge="end" color="inherit" onClick={props.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        </HideOnScroll>
        <Box mb={8}/>
        <Grid container className={classes.projectData}>
        <Grid item xs={12} sm={6}>
            <List dense disablePadding>
              <ListItem className={classes.listItem}>
                <ListItemText primaryTypographyProps={{variant: 'subtitle2'}} inset primary={checkPrimaryData(budget.project.address)} secondary="Ubicación" />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem}>
                <ListItemText inset primaryTypographyProps={{variant: 'subtitle2'}} primary={ budget.project.client != null && checkPrimaryData(budget.project.client.fullName)} secondary="Cliente" />
              </ListItem>
            </List>
        </Grid>
        <Grid item xs={12} sm={6}>
            <List dense disablePadding>
              <ListItem className={classes.listItem}>
                <ListItemText inset primaryTypographyProps={{variant: 'subtitle2'}} primary={new Date(checkPrimaryData(budget.createdAt)).toLocaleDateString('en-GB')} secondary="Fecha" />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem}>
                <ListItemText inset primaryTypographyProps={{variant: 'subtitle2'}} primary={checkPrimaryData(budget.architect)} secondary="Arquitecto" />
              </ListItem>
            </List>
        </Grid>
        </Grid>
        <br/>
        <Container maxWidth='xl' className={classes.backTb}>
          <EditTable setReload={setReload} units={units} options={options} data={data} setData={setData} columns={columns} url={`budgets/${props.id}/rows`} title='Renglones' label='renglon' budgetId={props.id}
          lookupEffects={[unitsEffect]} panels={panels}/>
        </Container>

      </Dialog>
    </div>
  );
}

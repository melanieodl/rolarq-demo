import React, {useState, useEffect, createRef, useRef, useCallback, useMemo, Fragment} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import api from '../api'
import isotipo from '../imgs/isotipo.png'

import {Button, Dialog, ListItemText, ListItem, List, Divider, AppBar, Toolbar,
        IconButton, Typography, Slide, Grid, Paper, TextField, Container,
        FormControl, Select, MenuItem, Box, Avatar} from '@material-ui/core'
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
  },
  logo: {
   width: theme.spacing(8),
   height: theme.spacing(8),
   marginRight: theme.spacing(2),
 },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



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
  const [total, setTotal] = useState()
  const [reload, setReload] = useState(false)

  const [budget, setBudget] = useState({project: {client: {}}});
  const [materials, setMaterials] = useState({})
  const renderCount = useRef(1)


  const refreshTotal = useCallback(() => setReload(prev => !prev), [])

  useEffect(() => {
    api.get(`budgets/${props.id}`)
    .then(response => {
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



  const checkPrimaryData = data => typeof data == undefined || data == null ? '               ' : data

  return (
    <div className={classes.backTb}>
      <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition} className={classes.backTb}
      PaperProps={{classes: {root: classes.backTb}}}>
      <HideOnScroll {...props}>

        <AppBar position='fixed'>
          <Toolbar >
            <Avatar alt="Rolarq logo" src={isotipo} className={classes.logo} variant='square' />

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

          <EditTable refreshTotal={refreshTotal}  budgetId={props.id}/>
        </Container>


      </Dialog>
    </div>
  );
}

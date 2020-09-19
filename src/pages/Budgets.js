import React, {useState, useEffect, Fragment} from "react"
import api from '../api'
import { withStyles } from '@material-ui/core/styles'
import {Container, Box, Badge, IconButton, Tooltip, TextField} from '@material-ui/core'
import Table from '../components/tables/EditableTb'
import MailIcon from '@material-ui/icons/Mail'
import BudgetsIcon from '@material-ui/icons/AccountBalanceWalletRounded'
import DescriptionIcon from '@material-ui/icons/Description'


import BudgetDetails from './BudgetDetails'



const BudgetsBadge = withStyles((theme) => ({
  badge: {
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);


const Budgets = props => {
  const [projects, setProjects] =  useState({});
  const [open, setOpen] = useState(false);
  const [idBudget, setIdBudget] = useState(null);


    const handleClickOpen = (id) => {
      setIdBudget(id)
      setOpen(true);
    };

  const handleClose = () => {
    setOpen(false);
  };



  const projectsEffect = () => {
    api.get('projects/catal')
    .then(response => {
      setProjects(response.data)
    })
    .catch(err => {
      console.log(err)
    })
  }
  const columns =    [
     { title: 'Id', field: 'id', hidden: true,  },
     { title: 'Nombre', field: 'name',
       validate: rowData => ( typeof rowData.name != 'undefined'?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false) },
     { title: 'Proyecto', field: 'project.id', lookup: projects, validate: rowData => ( typeof rowData.project != 'undefined')},
     { title: 'Utilidad', field: 'profitPct', type: 'numeric', render: rowData => `${rowData.profitPct} %`, width: '5%', align: 'right',
     initialEditValue: 0,
     validate: rowData => { if(typeof rowData.profitPct != 'undefined'){
                                return rowData.profitPct < 0 ?
                                     { isValid: false, helperText: 'Deber ser positivo' } : true}

                                return true},
      editComponent: props => <TextField defaultValue={0} type="number" inputProps={{min: 0,  fontSize: 10}}
      value={props.value} onChange={e => props.onChange(e.target.value)}/>},
     { title: 'Arquitecto', field: 'architect', initialEditValue: 'Fernando Roldan'},
     { title: 'Fecha de creación', field: 'createdAt', type: 'date', editable: 'never', dateSetting: {locale: 'en-GB'} },
     { title: 'Costo Total', field: 'totalCosts', type: 'currency', editable: 'never',
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}},
     { width: '5%', sorting: false,  render: (rowData) =>  typeof rowData != 'undefined' &&
            <Fragment>
              <Tooltip title="Presupuesto desglosado" placement="bottom">
                <IconButton onClick={(e) => {handleClickOpen(rowData.id)}} size='small' color="primary" aria-label="upload picture" component="span">
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>

            </Fragment>}
   ]

  return (
    <Fragment>
    <Box m={5} />
    <BudgetDetails open={open} handleClose={handleClose} id={idBudget}/>
    <Container fixed maxWidth="lg">
    <Table columns={columns} url='budgets' title='Presupuestos' label='presupuesto' lookupEffects={[projectsEffect]} />
    </Container>
    </Fragment>
  )

}
export default Budgets

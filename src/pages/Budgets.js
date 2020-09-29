import React, {useState, useEffect, Fragment} from "react"
import api from '../api'
import { withStyles } from '@material-ui/core/styles'
import {Container, Box, Badge, IconButton, Tooltip, TextField} from '@material-ui/core'
import Table from '../components/tables/BudgetsTb'
import MailIcon from '@material-ui/icons/Mail'
import BudgetsIcon from '@material-ui/icons/AccountBalanceWalletRounded'
// import DescriptionIcon from '@material-ui/icons/Description'
import DescriptionIcon from '@material-ui/icons/OpenInBrowserSharp';

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
     { title: 'Arquitecto', field: 'architect', initialEditValue: 'Fernando Roldan'},
     { title: 'Fecha de creación', field: 'createdAt', type: 'date', editable: 'never', dateSetting: {locale: 'en-GB'} },
     { title: 'Costo Total', field: 'totalCosts', type: 'currency', editable: 'never',
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}},
     { width: '5%', sorting: false,  render: (rowData) =>  typeof rowData != 'undefined' &&
            <Fragment>
              <Tooltip title="Abrir Presupuesto" placement="bottom">
                <IconButton onClick={(e) => {handleClickOpen(rowData.id)}} edge='start' color="primary" aria-label="upload picture" component="span">
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

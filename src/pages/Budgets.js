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
  const [budgetData, setBudgetData] = useState({})

  const [data, setData] = useState([])

  const updateBudget = ()=>{
      api.get(`budgets/${idBudget}`).then(
      (res) => {
        const dataUpdate = [...data]
        const index =budgetData.tableData.id
        const updatedRow = {...res.data, tableData: budgetData.tableData}
        dataUpdate[index] = updatedRow
        setData([...dataUpdate])
      }).catch((err) => console.log(err))

  }

    const handleClickOpen = (rowData) => {
      setIdBudget(rowData.id)
      setBudgetData(rowData);
      setOpen(true);
    };

  const handleClose = () => {
    setOpen(false);
    updateBudget();
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
     { width:'25%',title: 'Nombre', field: 'name',
       validate: rowData => ( typeof rowData.name != 'undefined'?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false) },
     { width:'25%', title: 'Proyecto', field: 'project.id', lookup: projects, validate: rowData => ( typeof rowData.project != 'undefined')},
     { width:'20%', title: 'Arquitecto', field: 'architect', initialEditValue: 'Fernando Roldan'},
     { width:'10%', title: 'Fecha de creación', field: 'createdAt', type: 'date', editable: 'never', dateSetting: {locale: 'en-GB'} },
     { width:'15%', title: 'Costo Total', field: 'totalCosts', type: 'currency', editable: 'never',
       currencySetting:{ locale: 'es-GT', currencyCode:'gtq', minimumFractionDigits:2, maximumFractionDigits:2}},
     { width: '5%', sorting: false,  render: (rowData) =>  typeof rowData != 'undefined' &&
            <Fragment>
              <Tooltip title="Abrir Presupuesto" placement="bottom">
                <IconButton onClick={(e) => {handleClickOpen(rowData)}} edge='start' color="primary" aria-label="upload picture" component="span">
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
    <Table data={data} setData={setData}
      columns={columns} url='budgets' title='Presupuestos' label='presupuesto' lookupEffects={[projectsEffect]} />
    </Container>
    </Fragment>
  )

}
export default Budgets

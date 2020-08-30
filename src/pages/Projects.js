import React, {useState, useEffect} from "react"
import api from '../api'
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

import {Container, Box, Badge, IconButton, Tooltip} from '@material-ui/core'
import Table from '../components/tables/EditableTb'
import MailIcon from '@material-ui/icons/Mail';
import BudgetsIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import ExpandLess from '@material-ui/icons/ExpandLessRounded';
import DetailsTb from '../components/tables/partials/ProjectBudgetsTb'


  const useStyles = makeStyles((theme) => ({

    panel: {
      paddingLeft: theme.spacing(12.5),
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(4)
    }

  }));
const BudgetsBadge = withStyles((theme) => ({
  badge: {
    top: 5,
    right: -2,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);


const Projects = props => {
  const classes = useStyles();

  const [clients, setClients] =  useState({});

  const clientsEffect = () => {
    api.get('clients/catal')
    .then(response => {
      setClients(response.data)
    })
    .catch(err => {
      console.log(err)
    })
  }
  const columns =    [
     { title: 'Id', field: 'id', hidden: true },
     { width: '5%', sorting: false, render: (rowData) => typeof rowData != 'undefined' && rowData.budgetsNumber > 0
         && <BudgetsBadge color='primary'
              children=
                    <BudgetsIcon size='small' color="inherited" style={{color: '#000'}}/>
              badgeContent={rowData.budgetsNumber} max={9} />},
     { title: 'Nombre', field: 'name',
       validate: rowData => ( typeof rowData.name != 'undefined'?
                                  rowData.name.trim() === '' ?
                                      { isValid: false, helperText: 'Nombre es requerido' } : true
                                  : false)},
     { title: 'Ubicación', field: 'address'},
     { title: 'Cliente', field: 'client.id', lookup: clients},
     { title: 'Descripción', field: 'description', cellStyle: {fontSize: 10}}

   ]

   const budgetsIcon = (props) =>
                       <BudgetsBadge color='primary'
                            children=
                                <IconButton size='small' color="inherited" style={{color: '#000'}}
                                 aria-label="upload picture" component="span">
                                  <BudgetsIcon/>
                                </IconButton>
                            badgeContent={props.budgetsNumber} max={9} />

   const panels = [
       rowData => ({
         openIcon: ExpandLess,
         tooltip: 'Presupuestos',
        render: rowData => {
            return (
              <div className={classes.panel}>
                <DetailsTb url={`/projects/${rowData.id}/budgets`} parentId={rowData.id}
                title='Presupuestos:' label="presupuesto"
                />
              </div>
            )
          },
       })
    ]

  return (
    <div>
    <Box m={5} />
    <Container fixed maxWidth="lg">
    <Table columns={columns} url='projects' title='Proyectos' label='proyecto' lookupEffects={[clientsEffect]} panels={panels}/>
    </Container>
    </div>
  )

}
export default Projects

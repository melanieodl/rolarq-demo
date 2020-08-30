import React, {forwardRef, createRef, useState, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import PropTypes from 'prop-types';
import {Container, Box, Paper, AppBar, Tabs, Tab, Typography} from '@material-ui/core'

import Table from '../components/tables/ReadOnlyTb'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));


const Proportions = props => {


   const classes = useStyles();
   const theme = useTheme();
   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
     setValue(newValue);
   };

   const handleChangeIndex = (index) => {
     setValue(index);
   };

    const morteroColumns =    [
       { title: 'Id', field: 'id', hidden: true },
       { title: 'Prop. Cemento', field: 'propCement'},
       { title: 'Prop. Arena', field:'propSand'},
       { title: 'Sacos Cemento', field: 'cement', type: 'numeric'},
       { title: 'Arena \u33A5', field: 'sand', type: 'numeric'},
       { title: 'Resistencia \u338F/\u33A0', field: 'kgPerSqrCm', type: 'numeric'},


     ]



  const concretoColumns =    [
     { title: 'Id', field: 'id', hidden: true },
     { title: 'Prop. Cemento', field: 'propCement'},
     { title: 'Prop. Arena', field:'propSand'},
     { title: 'Prop. Piedrín', field: 'propGravel'},
     { title: 'Sacos Cemento', field: 'cement', type: 'numeric'},
     { title: 'Arena \u33A5', field: 'sand', type: 'numeric'},
     { title: 'Piedrín \u33A5', field: 'gravel', type: 'numeric'},
     { title: 'Resistencia \u338F/\u33A0', field: 'kgPerSqrCm', type: 'numeric'},


   ]

  return (
    <div>
    <Box m={2} />
    <AppBar position="static" color="default">
       <Tabs
         value={value}
         onChange={handleChange}
         indicatorColor="primary"
         textColor="primary"
         variant="fullWidth"
         aria-label="full width tabs example"
       >
         <Tab label="Mortero" {...a11yProps(0)} />
         <Tab label="Concreto" {...a11yProps(1)} />
       </Tabs>
     </AppBar>
     <SwipeableViews
       axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
       index={value}
       onChangeIndex={handleChangeIndex}
     >
       <TabPanel value={value} index={0} dir={theme.direction}>
         <Container fixed maxWidth="lg">
           <Table columns={morteroColumns} url='morteros' title='Proporciones Volumetricas' label='mortero' />
         </Container>
       </TabPanel>
       <TabPanel value={value} index={1} dir={theme.direction}>
       <Container fixed maxWidth="lg">
         <Table columns={concretoColumns} url='concretos' title='Proporciones Volumetricas' label='concreto' />
       </Container>
       </TabPanel>
     </SwipeableViews>



    </div>
  )

}
export default Proportions

import React, {useState, useEffect, Fragment} from "react";

import TransversalForm from './TransversalForm'


export default function CimientoCorridoDialogForm(props) {




  return (

  <TransversalForm name="Cimiento Corrido" url='cimcorridos' elementos='Eslabones'
  budgetId={props.budgetId} setData={props.setData}
  openModal={props.openModal} closeModal={props.closeModal}
  />

  );
}

import React, {useState, useEffect, Fragment} from "react";

import TransversalForm from './TransversalForm'


export default function SoleraDialogForm(props) {




  return (

  <TransversalForm name="Solera" url='soleras' elementos='Estribos'
  budgetId={props.budgetId} setData={props.setData}
  openModal={props.openModal} closeModal={props.closeModal}
  />

  );
}

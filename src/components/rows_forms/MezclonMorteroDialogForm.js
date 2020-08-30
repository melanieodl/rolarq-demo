import React, {useState, useEffect, Fragment} from "react";

import MorteroForm from './MorteroForm'


export default function MezclonMorteroDialogForm(props) {




  return (

  <MorteroForm title="Mezclón de Mortero" url='mezclones' name=""
  budgetId={props.budgetId} setData={props.setData}
  openModal={props.openModal} closeModal={props.closeModal}
  />

  );
}

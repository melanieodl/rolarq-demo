import React, {useState, useEffect, Fragment} from "react";

import MorteroForm from './MorteroForm'


export default function RepelloDialogForm(props) {




  return (

  <MorteroForm title="Repello" url='repellos' name="Repello"
  budgetId={props.budgetId} setData={props.setData}
  openModal={props.openModal} closeModal={props.closeModal}
  />

  );
}

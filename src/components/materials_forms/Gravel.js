import React from 'react'
import SingleNameForm from './SingleNameForm'

export default function DialogForm(props) {
  return (

    <SingleNameForm url='gravels' title='Piedrín' label='piedrín' initialValue='Piedrín'
    closeModal={props.closeModal} openModal={props.openModal} setData={props.setData}/>
  )
}

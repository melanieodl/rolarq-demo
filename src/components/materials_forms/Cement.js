import React from 'react'
import SingleNameForm from './SingleNameForm'

export default function DialogForm(props) {
  return (
    <SingleNameForm url='cements' title='Cemento' label='cemento' initialValue='Cemento'
    closeModal={props.closeModal} openModal={props.openModal} setData={props.setData}/>

  )
}

import React, {Fragment} from 'react'
import {BlockForm, IronForm, TieWireForm, CoverPreMixForm} from './updateForms'
import {Dialog} from '@material-ui/core'


const map = {
  4: IronForm,
  5: TieWireForm,
  6: BlockForm,
  7: CoverPreMixForm,
  8: Fragment,
  9: Fragment

}


export default map;

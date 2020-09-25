import React, {Fragment} from 'react'
import {MaterialForm,
        CementForm, SandForm, GravelForm,
        BlockForm, IronForm, TieWireForm, CoverPreMixForm,
        ElectromallaForm, PaintForm} from './updateForms'
import {Dialog} from '@material-ui/core'


const map = {
  0: MaterialForm,
  1: CementForm,
  2: SandForm,
  3: GravelForm,
  4: IronForm,
  5: TieWireForm,
  6: BlockForm,
  7: CoverPreMixForm,
  8: PaintForm,
  9: ElectromallaForm

}


export default map;

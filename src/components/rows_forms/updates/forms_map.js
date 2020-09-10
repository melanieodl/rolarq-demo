import React from 'react'

import MuroUpdate from './MuroUpdate'
import MezclonConcretoUpdate from './MezclonConcretoUpdate'
import MezclonMorteroUpdate from './MezclonMorteroUpdate'
import RepelloUpdate from './RepelloUpdate'
import CernidoUpdate from './CernidoUpdate'

import {ZapataForm, LosaPlanaForm, LosaInclinadaForm, CimientoCorridoForm,
        SoleraForm, ColumnaForm, MuroForm} from '../updateForms'

const map = {
    1: ZapataForm,
    2: LosaPlanaForm,
    3: LosaInclinadaForm,
    4: CimientoCorridoForm,
    5: SoleraForm,
    6: ColumnaForm,
    7: MuroUpdate,
    8: MezclonConcretoUpdate,
    9:  MezclonMorteroUpdate,
    10: RepelloUpdate,
    11: CernidoUpdate,

}


export default map;

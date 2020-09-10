import React from 'react'

import LosaPlanaUpdate from './LosaPlanaUpdate'
import LosaInclinadaUpdate from './LosaInclinadaUpdate'
import CimientoCorridoUpdate from './CimientoCorridoUpdate'
import SoleraUpdate from './SoleraUpdate'
// import ColumnaUpdate from './ColumnaUpdate'
import MuroUpdate from './MuroUpdate'
import MezclonConcretoUpdate from './MezclonConcretoUpdate'
import MezclonMorteroUpdate from './MezclonMorteroUpdate'
import RepelloUpdate from './RepelloUpdate'
import CernidoUpdate from './CernidoUpdate'

import {ZapataForm, ColumnaForm} from '../updateForms'

const map = {
    1: ZapataForm,
    2: LosaPlanaUpdate,
    3: LosaInclinadaUpdate,
    4: CimientoCorridoUpdate,
    5: SoleraUpdate,
    6: ColumnaForm,
    7: MuroUpdate,
    8: MezclonConcretoUpdate,
    9:  MezclonMorteroUpdate,
    10: RepelloUpdate,
    11: CernidoUpdate,

}


export default map;

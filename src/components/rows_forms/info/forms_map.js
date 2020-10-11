import React from 'react'

import {ZapataForm, LosaPlanaForm, LosaInclinadaForm, CimientoCorridoForm,
        SoleraForm, ColumnaForm, ColumnaEspecialForm, MuroForm,
        MezclonConcretoForm, MezclonMorteroForm, MezclonExtForm,
        RepelloForm, PinturaForm,
        RowForm} from '../updateForms'

const map = {
    0: RowForm,
    1: ZapataForm,
    2: LosaPlanaForm,
    3: LosaInclinadaForm,
    4: CimientoCorridoForm,
    5: SoleraForm,
    6: ColumnaForm,
    7: MuroForm,
    8: MezclonConcretoForm,
    9: MezclonMorteroForm,
    10: RepelloForm,
    11: MezclonExtForm,//Mezclon con concreto con electromaya
    12: ColumnaEspecialForm,
    13: PinturaForm,
    14: MezclonExtForm

}


export default map;

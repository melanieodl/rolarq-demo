import React from 'react'
import * as Yup from 'yup'

const strReq = Yup.string()
               .required('Requerido')

const positiveReq = Yup.number()
                   .positive('Deber ser positivo')
                   .required('Requerido')

const quantityReq = Yup.number()
                   .positive('Deber ser positivo')
                   .integer('Deber ser un número entero ')
                   .required('Requerido')

const floatQuantityReq = Yup.number()
                        .positive('Debe ser positivo')
                        .required('Requerido')

const mixedReq = Yup.mixed()
                 .required('Requerido')

const pct = Yup.number()
                 .min(0, 'Debe ser un numero entre 0 - 100').max(100, 'Debe ser un numero entre 0 - 100').nullable()

const boolFalse = Yup.boolean().default(false)

const schemas = {
        name: strReq,
        profitPct: pct,
        amount: quantityReq,
        unitAmount: floatQuantityReq,
        unit: mixedReq,
        length: positiveReq,
        width: positiveReq,
        height: positiveReq,
        area: positiveReq,
        wallArea: positiveReq,
        ceilArea: positiveReq,
        knotsPerPound: positiveReq,
        sqrMtsPerBag: positiveReq,
        sqrMtsPerGal: positiveReq,
        recubrimiento: positiveReq,
        separacion: positiveReq,
        junta: positiveReq,
        longHook: positiveReq,
        longPata: positiveReq,
        cantLongsElems: quantityReq,
        cantLongsAuxElems: quantityReq,
        cantTransElems: quantityReq,
        propTension: pct,
        estribosDouble: boolFalse,
        mixProp: mixedReq,
        cement: mixedReq,
        sand: mixedReq,
        gravel: mixedReq,
        iron: mixedReq,
        longIron: mixedReq,
        longIronAux: mixedReq,
        transIron: mixedReq,
        tieWire: mixedReq,
        block: mixedReq,
        preMix: mixedReq,
        wallPaint: mixedReq,
        ceilPaint: mixedReq,
        electromalla: mixedReq,
        cementPrice: mixedReq,
        sandPrice: mixedReq,
        gravelPrice: mixedReq,
        ironPrice: mixedReq,
        longIronPrice: mixedReq,
        longIronAuxPrice: mixedReq,
        transIronPrice: mixedReq,
        tieWirePrice: mixedReq,
        blockPrice: mixedReq,
        preMixPrice: mixedReq,
        wallPaintPrice: mixedReq,
        ceilPaintPrice: mixedReq,
        electromallaPrice: mixedReq,
        cementWastePct: pct,
        sandWastePct: pct,
        gravelWastePct: pct,
        ironWastePct: pct,
        longIronWastePct: pct,
        longIronAuxWastePct: pct,
        transIronWastePct: pct,
        tieWireWastePct: pct,
        blockWastePct: pct,
        preMixWastePct: pct,
        wallPaintWastePct: pct,
        ceilPaintWastePct: pct,
        electromallaWastePct: pct}

export const {name,
              profitPct,
              amount,
              unitAmount,
              unit,
              length,
              width,
              height,
              area,
              wallArea,
              ceilArea,
              knotsPerPound,
              sqrMtsPerBag,
              sqrMtsPerGal,
              recubrimiento,
              separacion,
              junta,
              longHook,
              longPata,
              cantLongsElems,
              cantLongsAuxElems,
              cantTransElems,
              propTension,
              estribosDouble,
              mixProp,
              cement,
              sand,
              gravel,
              iron,
              longIron,
              longIronAux,
              transIron,
              tieWire,
              block,
              preMix,
              wallPaint,
              ceilPaint,
              electromalla,
              cementPrice,
              sandPrice,
              gravelPrice,
              ironPrice,
              longIronPrice,
              longIronAuxPrice,
              transIronPrice,
              tieWirePrice,
              blockPrice,
              preMixPrice,
              wallPaintPrice,
              ceilPaintPrice,
              electromallaPrice,
              cementWastePct,
              sandWastePct,
              gravelWastePct,
              ironWastePct,
              longIronWastePct,
              longIronAuxWastePct,
              transIronWastePct,
              tieWireWastePct,
              blockWastePct,
              preMixWastePct,
              wallPaintWastePct,
              ceilPaintWastePct,
              electromallaWastePct} = schemas

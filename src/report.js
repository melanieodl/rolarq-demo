import api from './api'
import axios from 'axios'

import underscore from 'underscore'

import XLSX from 'sheetjs-style'

//STYLES
const styles = {

    title: {									// style for the page title
        font: {
          name: 'Arial',
          sz: 14,
          bold: true,
          color: { rgb: "FFFFFFFF" },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        fill: {
          bgColor: {rgb: "FF424242"},
          fgColor: {rgb: "FF424242"},
        },
    },
    subTitle: {									// style for subtitle or divisions
        font: {
          name: 'Arial',
          sz: 12,
          bold: true,
          color: { rgb: "FFFFFFFF" },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        fill: {
          bgColor: {rgb: "FF1D4D87"},
          fgColor: {rgb: "FF1D4D87"},
        },
    },
    tableHeader: {									// style of the header cells of the table
        font: {
          name: 'Arial',
          sz: 10,
          bold: true,
          color: { rgb: "FFFFFFFF" },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        fill: {
          bgColor: {rgb: "FF1D4D87"},
          fgColor: {rgb: "FF1D4D87"},
        },
    },
    supplierHeader: {									// style of the header cells of the table
        font: {
          name: 'Arial',
          sz: 10,
          bold: true,
          color: { rgb: "ff0a6266" },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        },
        fill: {
          bgColor: {rgb: "ffe3f0f0"},
          fgColor: {rgb: "ffe3f0f0"},
        },
    },
    tableSubTitle: {
        font: {
          name: 'Arial',
          sz: 10,
          bold: true,
        },
        alignment: {
          horizontal: 'left',
          vertical: 'center'
        },
        fill: {
          bgColor: {rgb: "FFF5F5F5"},
          fgColor: {rgb: "FFF5F5F5"},
        },
    },
    rowSubTotal: {
      font: {
        name: 'Arial',
        sz: 10,
        bold: true,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
      fill: {
        bgColor: {rgb: "E3F0F0"},
        fgColor: {rgb: "E3F0F0"},
      },
    },
    groupTotal: {
      font: {
        name: 'Arial',
        sz: 10,
        bold: true,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
    },
    tableCell: {                // style of the table cell
      font: {
        name: 'Arial',
        sz: 10,
      },
      alignment: {
        vertical: 'center'
      },

    },

}


//GENERATE DATA
const checkNull = value => value || ''

const rowData = (row, idx ) => ([[idx + 1, row.fullName || '', row.unitAmount || '', row.unit.symbol || '', row.unitCost || 0, row.totalCost || 0]])

const rowCostData = data => data.map((cost) => ({
                                "No.": "",
                                "DESCRIPCION": cost.name,
                                "CANTIDAD": cost.totalAmount,
                                "UNIDAD": cost.unit.symbol,
                                "COSTO UNIT.": cost.price,
                                "COSTO TOTAL": cost.totalPrice}))

const summaryData = data => data.map((row, idx) => ({
                                "No.": idx + 1,
                                "DESCRIPCION": row.fullName,
                                "CANTIDAD": row.unitAmount,
                                "UNIDAD": row.unit.symbol,
                                "COSTO UNIT.": row.unitCost || 0,
                                "COSTO TOTAL": row.totalCost || 0}))



const materialsData = data => data.map((row, idx) => ({
                                "No.": idx + 1,
                                "DESCRIPCION": row.name,
                                "CANTIDAD": row.amount,
                                "UNIDAD": row.unit,
                                "PRECIO": row.price,
                                "TOTAL": row.total,
                                "PROVEEDOR": row.supplier,
                              }))


const titleReport = name => ([[`PRESUPUESTO ${name.toUpperCase()}`]])
const projectInfo = (address, client, architect) =>[['UBICACIÓN'], [`${checkNull(address).toUpperCase()}`],
                     ['CLIENTE'], [client ? `${client.name.toUpperCase()}` : ''],
                     ['ARQUITECTO'], [`${checkNull(architect).toUpperCase()}`]]


let idInfo = budgetName =>  [['FECHA', `${new Date().toLocaleDateString('en-GB')}`],
             ['PRESUPUESTO', `${checkNull(budgetName).toUpperCase()}`]]


const totalCost = data =>  data.reduce((total, {totalCost}) => total + totalCost, 0);

const setWSHeader = (data, title) => {
  var ws = XLSX.utils.aoa_to_sheet([[]]);

  const {project, client, architect, name} = data;
  const titleCellAdd = 'A1'
  const subTitleAdd = 'A8'
  const generalInfoAdd = 'B2'
  const dateCaptionAdd = 'D2'
  const dateAdd = 'E2'
  const budgetCaptionAdd = 'D3'
  const budgetAdd = 'E3'
  //Celdas compuestas
 ws['!merges'] = [ {s: {r:0, c: 0}, e:{r:0, c:4}},
                          {s: {r:0, c: 5}, e:{r:6, c:5}},
                          {s: {r:7, c: 0}, e:{r:7, c:5}}]
  //Ancho de columnas
  if(!ws['!cols']) ws['!cols'] = [];
  ws['!cols'][0] = { wch: 3 };
  ws['!cols'][1] = { wch: 50 };
  ws['!cols'][2] = { wch: 12 };
  ws['!cols'][3] = { wch: 12 };
  ws['!cols'][4] = { wch: 15 };
  ws['!cols'][5] = { wch: 18 };
  ws['!cols'][6] = { wch: 50 };


  //Informacion de encabezado
  XLSX.utils.sheet_add_aoa(ws, titleReport(project.name), {origin: titleCellAdd});
  XLSX.utils.sheet_add_aoa(ws, [[`${title}`]], {origin: subTitleAdd});
  XLSX.utils.sheet_add_aoa(ws, [['']], {origin: 'G8'});
  XLSX.utils.sheet_add_aoa(ws, projectInfo(project.address, client, architect), {origin: generalInfoAdd});
  XLSX.utils.sheet_add_aoa(ws, idInfo(name), {origin: dateCaptionAdd});

  //Estilos a celdas
  ws[titleCellAdd].s = styles.title
  ws[subTitleAdd].s = styles.subTitle
  //information general
  for (var i = 2; i < 8; i++) {
    if(i % 2 == 0) {ws[`B${i}`].s = styles.tableCell
      }else {
        ws[`B${i}`].s = {...styles.tableCell, font: {name: 'Arial', sz: 12, bold: true}}
      }
  }
  //informacion fecha y presupuesto
  ws[dateCaptionAdd].s = styles.tableCell
  ws[budgetCaptionAdd].s = styles.tableCell
  ws[dateAdd].s = {...styles.tableCell, font: {name: 'Arial', sz: 12, bold: true}}
  ws[budgetAdd].s = {...styles.tableCell, font: {name: 'Arial', sz: 12, bold: true}}



  return ws
}

const setHeightRows = ws => {
  // get worksheet range
  var range = XLSX.utils.decode_range(ws['!ref']);

  //Alto filas
  for (var i = range.s.r; i <= range.e.r; i++) {
    if(!ws['!rows']) ws['!rows'] = [];
    ws['!rows'][i] = {hpt: 18}
    if(i === 0) ws['!rows'][i] = {hpt: 22}//Titulo
  }

  return ws
}

const setNumFormats = ws => {
  const range = XLSX.utils.decode_range(ws['!ref']);
  //formato Q. currency
  const N = XLSX.utils.decode_col("A"); // 1 numeracion
  const C = XLSX.utils.decode_col("C"); // 1 numeracion
  const U = XLSX.utils.decode_col("E"); // 5 costo unitario
  const T = XLSX.utils.decode_col("F"); // 6 costo total
  const gtq = '"Q"#,##0.00'; // formato Q0.00 currency GTQ
  const no = '#'; // formato 1 numeracion
  const qt = '0.00'; // formato 0.00 quantity

  for(var i = range.s.r + 9; i <= range.e.r; i++) {
    /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */

    let num = XLSX.utils.encode_cell({r:i, c:N});
    let cant = XLSX.utils.encode_cell({r:i, c:C});
    let unit = XLSX.utils.encode_cell({r:i, c:U});
    let total = XLSX.utils.encode_cell({r:i, c:T});

    /* if the particular row did not contain data for the column, the cell will not be generated */
    if(ws[num]){
      /* `.t == "n"` for number cells */
      if(ws[num].t != 'n') {
        continue;
      } else {
        /* assign the `.z` number format */
        ws[num].z = no;
      }
    }

    /* if the particular row did not contain data for the column, the cell will not be generated */
    if(ws[cant]){
      /* `.t == "n"` for number cells */
      if(ws[cant].t != 'n') {
        continue;
      } else {
        /* assign the `.z` number format */
        ws[cant].z = qt;
      }
    }

    /* if the particular row did not contain data for the column, the cell will not be generated */
    if(ws[unit]){
      /* `.t == "n"` for number cells */
      if(ws[unit].t != 'n') {
        continue;
      } else {
        /* assign the `.z` number format */
        ws[unit].z = gtq;
      }
    }

    /* if the particular row did not contain data for the column, the cell will not be generated */
    if(ws[total]){
      /* `.t == "n"` for number cells */
      if(ws[total].t != 'n') {
        continue;
      } else {
        /* assign the `.z` number format */
        ws[total].z = gtq;
      }
    }

  }

  return ws


}

//RESUMEN DE PRESUPUESTO WS
const summaryWS = data => {
  var workSheet = setWSHeader(data[0].budget, 'RESUMEN DE PRESUPUESTO')
  const nRows = data.length //numero de filas en la tabla de datos



  //direcciones de las celdas origen

  const tableDataAdd = 'A9'
  const tableDataRowAdd = '9'
  const totalTitleAdd = `A${nRows + 10}`
  const totalAdd = `F${nRows + 10}`


  workSheet['!merges'] = [...workSheet['!merges'],
                  {s: {r:nRows + 9, c:0}, e: {r: nRows + 9, c: 4}}]


  //Informacion Tabla de datos
  XLSX.utils.sheet_add_json(workSheet, summaryData(data), {origin: tableDataAdd});
  XLSX.utils.sheet_add_aoa(workSheet, [['COSTO TOTAL']], {origin: totalTitleAdd});
  XLSX.utils.sheet_add_aoa(workSheet, [[totalCost(data)]], {origin: totalAdd});



  //encabezado tabla
  workSheet[tableDataAdd].s = styles.tableHeader
  workSheet[`B${tableDataRowAdd}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
  workSheet[`C${tableDataRowAdd}`].s = styles.tableHeader
  workSheet[`D${tableDataRowAdd}`].s = styles.tableHeader
  workSheet[`E${tableDataRowAdd}`].s = styles.tableHeader
  workSheet[`F${tableDataRowAdd}`].s = styles.tableHeader

  var range = XLSX.utils.decode_range(workSheet['!ref']);

  //celdas Tabla
  for(var i = range.s.r + 9; i <= nRows + 9; ++i){
    for(var j = range.s.c; j <= 5; ++j){
      if(j < 2){
        if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;
        workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'left', vertical: 'center'}}
      }
      else if (j < 4 && j >= 2) {
        if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

        workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'center', vertical: 'center'}}
      }
      else {
        if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

        workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = styles.tableCell
      }
    }
  }
  //total tabla
  workSheet[totalTitleAdd].s = styles.subTitle
  workSheet[totalAdd].s = {...styles.subTitle, alignment: {horizontal:'right', vertical: 'center'}}


  workSheet = setNumFormats(workSheet)


  //Formulas
  workSheet[totalAdd].z = '"Q"#,##0.00'
  workSheet[totalAdd].f = `SUM(${XLSX.utils.encode_cell({r: 9, c: 5})}:${XLSX.utils.encode_cell({r: nRows + 8, c: 5})})`
  workSheet[totalAdd].F =`${totalAdd}:${totalAdd}`



  return setHeightRows(workSheet)
}

//RESUMEN DE MATERIALES
const materialsWS = async data => {
  var workSheet = setWSHeader(data[0].budget, 'LISTADO DE MATERIALES')

  const idRows = data.map(({id}) => id) //arreglo con el id de los renglones
  const costs = await getCosts(await idRows)
  const nRows = await costs.length //numero de filas en la tabla de datos

  const {project, client, architect, name} = data[0].budget;


  async function getCostsByRow(idRows){
      let costs = Promise.all(idRows.map( async id => {
          try {
            const res = await api.get(`rows/${id}/mtlcosts`);
            return res.data
          } catch (err) {
            console.log(err);
          }
        }))


      return costs;
  }


  async function getCosts(idRows){
    let costsByRow = await getCostsByRow(idRows);
    let groupedCosts = await Object.values(underscore.groupBy(underscore.flatten(costsByRow), cost => cost.materialPrice.id));
    return await groupedCosts.map(group => group.reduce((resume, cost) => {
                                                    console.log('Costo en materiales export', cost);
                                                    resume.name = cost.name
                                                    resume.amount = resume.amount + cost.totalAmount
                                                    resume.unit = cost.unit.symbol
                                                    resume.price = cost.price
                                                    resume.total = resume.total + cost.totalPrice
                                                    resume.supplier = cost.materialPrice.supplier ? `${cost.materialPrice.supplier.name || ''}`: ''
                                                    return resume
                                                  } , {name: '', amount: 0, unit:'', price: '', total: 0, supplier: ''} ))
  }

  //direcciones de las celdas origen

  const tableDataAdd = 'A9'
  const tableDataRowAdd = '9'
  const totalTitleAdd = `A${nRows + 10}`
  const totalAdd = `F${nRows + 10}`

  //Celdas compuestas
   workSheet['!merges'] = [ {s: {r:0, c: 0}, e:{r:0, c:4}},
                            {s: {r:0, c: 5}, e:{r:6, c:5}},
                            {s: {r:7, c: 0}, e:{r:7, c:5}},
                            {s: {r:nRows + 9, c:0}, e: {r: nRows + 9, c: 4}}]



    //Informacion Tabla de datos
    XLSX.utils.sheet_add_json(workSheet, materialsData(await costs), {origin: tableDataAdd});
    XLSX.utils.sheet_add_aoa(workSheet, [['']], {origin: totalAdd});


      // get worksheet range
      var range = XLSX.utils.decode_range(workSheet['!ref']);

      //Estilos de celdas
      //information general
      for (var i = 2; i < 8; i++) {
        if(i % 2 == 0) {workSheet[`B${i}`].s = styles.tableCell
          }else {
            workSheet[`B${i}`].s = {...styles.tableCell, font: {name: 'Arial', sz: 12, bold: true}}
          }
      }
      if(await costs.length > 0){
        //encabezado tabla
        workSheet[tableDataAdd].s = styles.tableHeader
        workSheet[`B${tableDataRowAdd}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
        workSheet[`C${tableDataRowAdd}`].s = styles.tableHeader
        workSheet[`D${tableDataRowAdd}`].s = styles.tableHeader
        workSheet[`E${tableDataRowAdd}`].s = styles.tableHeader
        workSheet[`F${tableDataRowAdd}`].s = styles.tableHeader
        workSheet[`G${tableDataRowAdd - 1}`].s = styles.supplierHeader
        workSheet[`G${tableDataRowAdd}`].s = styles.supplierHeader




      }

      //celdas Tabla
      for(var i = range.s.r + 9; i <= nRows + 9; ++i){
        for(var j = range.s.c; j <= 6; ++j){
          if(j < 2){
            if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;
            workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'left', vertical: 'center'}}
          }
          else if (j < 4 && j >= 2) {
            if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

            workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'center', vertical: 'center'}}
          }
          else {
            if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

            workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = styles.tableCell
          }
        }
      }

      //total tabla
      if(await costs.length > 0){
        XLSX.utils.sheet_add_aoa(workSheet, [['COSTO TOTAL']], {origin: totalTitleAdd});
        //Formulas
        workSheet[totalTitleAdd].s = styles.subTitle
        //FORMULA DEL FINAL
        workSheet[totalAdd].z = '"Q"#,##0.00'
        workSheet[totalAdd].F =`${totalAdd}:${totalAdd}`
        workSheet[totalAdd].f = `SUM(${XLSX.utils.encode_cell({r: 9, c: 5})}:${XLSX.utils.encode_cell({r: nRows + 8, c: 5})})`
        workSheet[totalAdd].s = {...styles.subTitle, alignment: {horizontal:'right', vertical: 'center'}}
      }

  workSheet = setNumFormats(workSheet)

  console.log('costos', await costs);
  return setHeightRows(workSheet)
}

//PRESUPUESTO desglosado
const budgetWS = async rows => {
  var workSheet = setWSHeader(rows[0].budget, 'PRESUPUESTO DESGLOSADO')

  const data = await getData(await rows)
  const nRows = await data.length //numero de filas en la tabla de datos
  var activeRow = 9;

  const {project, client, architect, name} = rows[0].budget;
  const gtq = '"Q"#,##0.00'; // formato Q0.00 currency GTQ
  const no = '#'; // formato 1 numeracion
  const qt = '0.00'; // formato 0.00 quantity

  async function addCosts(rows) {
    let costs = Promise.all(rows.map( async row => {
            try {
              const materials = await api.get(`rows/${row.id}/mtlcosts`)
              const workForce = await api.get(`rows/${row.id}/wfcosts`)
              const indirect = await api.get(`rows/${row.id}/indcosts`);
              return {...row, materialCosts: materials.data,
                              workForceCosts: workForce.data,
                              indirectCosts: indirect.data}
            } catch (err) {
              console.log(err);
            }
        }))


    return costs;

  }

  async function getData(rows){
    return await addCosts(rows)
  }


    if(!workSheet['!rows']) workSheet['!rows'] = [];

    //Informacion Tabla de datos
      data.forEach( async (row, idx) => {
        //Encabezado del renglo
        activeRow++

        XLSX.utils.sheet_add_json(workSheet, rowData(row, idx), {origin: `A${activeRow++}`, skipHeader:true});
        workSheet[`A${activeRow - 1}`].s = styles.tableHeader
        workSheet[`A${activeRow - 1}`].z = no
        workSheet[`B${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
        workSheet[`C${activeRow - 1}`].s = styles.tableHeader
        workSheet[`C${activeRow - 1}`].z = qt
        workSheet[`D${activeRow - 1}`].s = styles.tableHeader
        workSheet[`E${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}
        workSheet[`E${activeRow - 1}`].z = gtq
        workSheet[`F${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}
        workSheet[`F${activeRow - 1}`].z = gtq




        XLSX.utils.sheet_add_aoa(workSheet, [["", "DESCRIPCION", "CANTIDAD", "UNIDAD", "COSTO UNIT.", "COSTO TOTAL"]], {origin: `A${activeRow++}`});
        workSheet[`A${activeRow - 1}`].s = styles.tableHeader
        workSheet[`B${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
        workSheet[`C${activeRow - 1}`].s = styles.tableHeader
        workSheet[`D${activeRow - 1}`].s = styles.tableHeader
        workSheet[`E${activeRow - 1}`].s = styles.tableHeader
        workSheet[`F${activeRow - 1}`].s = styles.tableHeader

        if(row.materialCosts.length > 0){
            XLSX.utils.sheet_add_aoa(workSheet, [["", "MATERIALES", "", "", "", ""]], {origin: `A${activeRow++}`});
            workSheet[`A${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`B${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`C${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`D${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`E${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`F${activeRow - 1}`].s = styles.tableSubTitle
            XLSX.utils.sheet_add_json(workSheet, rowCostData(row.materialCosts), {origin: `A${activeRow}`, skipHeader:true});
            for(var i = activeRow - 1; i < activeRow + row.materialCosts.length + 9; i++){
              for(var j = 0; j <= 5; ++j){
                if(j < 2){
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;
                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'left', vertical: 'center'}}
                }
                else if (j < 4 && j >= 2) {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'center', vertical: 'center'}}
                }
                else {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = styles.tableCell
                }
              }
            }

            for (var i = activeRow - 1; i < activeRow + row.materialCosts.length + 9; i++) {
              if(!workSheet[XLSX.utils.encode_cell({r: i, c: 2})]) continue;
              workSheet[XLSX.utils.encode_cell({r: i , c: 2})].z = qt
            }
            activeRow += row.materialCosts.length


            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "Subtotal de materiales", "", "", "", `${row.materialCost}`]], {origin: `A${activeRow++}`});
            workSheet[`B${activeRow - 1}`].s = styles.groupTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.groupTotal, alignment: {horizontal: 'right', vertical: 'center'}}
            workSheet[`F${activeRow - 1}`].t = 'n'
            workSheet[`F${activeRow - 1}`].z = gtq


        }


        if(row.workForceCosts.length > 0){
            XLSX.utils.sheet_add_aoa(workSheet, [["", "MANO DE OBRA", "", "", "", ""]], {origin: `A${activeRow++}`});
            workSheet[`A${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`B${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`C${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`D${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`E${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`F${activeRow - 1}`].s = styles.tableSubTitle
            XLSX.utils.sheet_add_json(workSheet, rowCostData(row.workForceCosts), {origin: `A${activeRow}`, skipHeader:true});
            for(var i = activeRow - 1; i < activeRow + row.workForceCosts.length + 9; i++){
              for(var j = 0; j <= 5; ++j){
                if(j < 2){
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;
                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'left', vertical: 'center'}}
                }
                else if (j < 4 && j >= 2) {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'center', vertical: 'center'}}
                }
                else {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = styles.tableCell
                }
              }
            }

            for (var i = activeRow - 1; i < activeRow + row.workForceCosts.length + 9; i++) {
              if(!workSheet[XLSX.utils.encode_cell({r: i, c: 2})]) continue;
              workSheet[XLSX.utils.encode_cell({r: i , c: 2})].z = qt
            }
            activeRow += row.workForceCosts.length

            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "Subtotal de mano de obra", "", "", "", `${row.workForceCost}`]], {origin: `A${activeRow++}`});
            workSheet[`B${activeRow - 1}`].s = styles.groupTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.groupTotal, alignment: {horizontal: 'right', vertical: 'center'}}
            workSheet[`F${activeRow - 1}`].t = 'n'
            workSheet[`F${activeRow - 1}`].z = gtq


        }


        if(row.directCost){
            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "TOTAL COSTOS DIRECTOS", "", "", "", `${row.directCost}`]], {origin: `A${activeRow++}`})
            workSheet[`A${activeRow - 1}`].s = styles.rowSubTotal
            workSheet[`B${activeRow - 1}`].s = styles.rowSubTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.rowSubTotal,  alignment: {horizontal: 'right', vertical: 'center'}}
            workSheet[`F${activeRow - 1}`].t = 'n'
            workSheet[`F${activeRow - 1}`].z = gtq

          }

        if(row.indirectCosts.length > 0){
            XLSX.utils.sheet_add_aoa(workSheet, [["", "COSTOS INDIRECTOS", "", "", "", ""]], {origin: `A${activeRow++}`});
            workSheet[`A${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`B${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`C${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`D${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`E${activeRow - 1}`].s = styles.tableSubTitle
            workSheet[`F${activeRow - 1}`].s = styles.tableSubTitle
            XLSX.utils.sheet_add_json(workSheet, rowCostData(row.indirectCosts), {origin: `A${activeRow}`, skipHeader:true});
            for(var i = activeRow - 1; i < activeRow + row.indirectCosts.length + 9; i++){
              for(var j = 0; j <= 5; ++j){
                if(j < 2){
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;
                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'left', vertical: 'center'}}
                }
                else if (j < 4 && j >= 2) {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = {...styles.tableCell, alignment: {horizontal: 'center', vertical: 'center'}}
                }
                else {
                  if(!workSheet[XLSX.utils.encode_cell({r: i, c: j})]) continue;

                  workSheet[XLSX.utils.encode_cell({r: i, c: j})].s = styles.tableCell
                }
              }
            }
            for (var i = activeRow - 1; i < activeRow + row.indirectCosts.length + 9; i++) {
              if(!workSheet[XLSX.utils.encode_cell({r: i, c: 2})]) continue;

                workSheet[XLSX.utils.encode_cell({r: i , c: 2})].z = qt
            }
            activeRow += row.indirectCosts.length

        }

        workSheet['!merges'] = [ ...workSheet['!merges'],
                               { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]

        if(row.indirectCost) {
            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "TOTAL COSTOS INDIRECTOS", "", "", "", `${row.indirectCost}`]], {origin: `A${activeRow++}`})
                workSheet[`A${activeRow - 1}`].s = styles.rowSubTotal
                workSheet[`B${activeRow - 1}`].s = styles.rowSubTotal
                workSheet[`F${activeRow - 1}`].s = {...styles.rowSubTotal,  alignment: {horizontal: 'right', vertical: 'center'}}
                workSheet[`F${activeRow - 1}`].t = 'n'
                workSheet[`F${activeRow - 1}`].z = gtq

        }


           if(row.materialCosts.length !== 0 || row.workForceCosts.length !== 0 || row.indirectCosts.length !== 0){
             workSheet['!merges'] = [ ...workSheet['!merges'],
                                    { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
             XLSX.utils.sheet_add_aoa(workSheet, [["", "COSTO TOTAL RENGLON", "", "", "", `${row.totalCost || 0}`]], {origin: `A${activeRow++}`});
             workSheet[`A${activeRow - 1}`].s = styles.tableHeader
             workSheet[`B${activeRow - 1}`].s = styles.tableHeader
             workSheet[`F${activeRow - 1}`].t = 'n'
             workSheet[`F${activeRow - 1}`].z = gtq
             workSheet[`F${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}

           }





    })

  console.log('presupuesto desglosado', await data);

  return setHeightRows(workSheet)



}





export {summaryWS, materialsWS, budgetWS}

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

const rowData = (row, idx ) => ([[idx + 1, row.fullName, row.unitAmount, row.unit.symbol, row.unitCost || 0, row.totalCost || 0]])

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
                                "TOTAL": row.total}))


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

  //Informacion de encabezado
  XLSX.utils.sheet_add_aoa(ws, titleReport(project.name), {origin: titleCellAdd});
  XLSX.utils.sheet_add_aoa(ws, [[`${title}`]], {origin: subTitleAdd});
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


  //formato Q. currency
  var U = XLSX.utils.decode_col("E"); // 5 costo unitario
  var T = XLSX.utils.decode_col("F"); // 6 costo total
  var fmt = '"Q"#,##0.00'; // formato Q0.00

  // for(var i = range.s.r + 9; i <= range.e.r; ++i) {
  //   /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
  //   var unit = XLSX.utils.encode_cell({r:i, c:U});
  //
  //   /* if the particular row did not contain data for the column, the cell will not be generated */
  //   if(!workSheet[unit]) continue;
  //   /* `.t == "n"` for number cells */
  //   if(workSheet[unit].t != 'n') continue;
  //   /* assign the `.z` number format */
  //   workSheet[unit].z = fmt;
  //
  // }
  // for(var i = range.s.r + 9; i <= range.e.r; ++i) {
  //   /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
  //   var total = XLSX.utils.encode_cell({r:i, c:T});
  //
  //   /* if the particular row did not contain data for the column, the cell will not be generated */
  //   if(!workSheet[total]) continue;
  //   /* `.t == "n"` for number cells */
  //   if(workSheet[total].t != 'n') continue;
  //   /* assign the `.z` number format */
  //   workSheet[total].z = fmt;
  //
  // }


  //Formulas
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
                                                    return resume
                                                  } , {name: '', amount: 0, unit:'', price: '', total: 0} ))
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
    XLSX.utils.sheet_add_aoa(workSheet, [[0]], {origin: totalAdd});


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

        //FORMULA DEL FINAL
        workSheet[totalAdd].F =`${totalAdd}:${totalAdd}`


      }

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
        //Formulas
        workSheet[totalAdd].f = `SUM(${XLSX.utils.encode_cell({r: 9, c: 5})}:${XLSX.utils.encode_cell({r: nRows + 8, c: 5})})`


      //total tabla
      if(await costs.length > 0){
        XLSX.utils.sheet_add_aoa(workSheet, [['COSTO TOTAL']], {origin: totalTitleAdd});
        workSheet[totalTitleAdd].s = styles.subTitle

      }
      workSheet[totalAdd].s = {...styles.subTitle, alignment: {horizontal:'right', vertical: 'center'}}


      //formato Q. currency
      var U = XLSX.utils.decode_col("E"); // 5 costo unitario
      var T = XLSX.utils.decode_col("F"); // 6 costo total
      var fmt = '"Q"#,##0.00'; // formato Q0.00





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
        workSheet[`B${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
        workSheet[`C${activeRow - 1}`].s = styles.tableHeader
        workSheet[`D${activeRow - 1}`].s = styles.tableHeader
        workSheet[`E${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}
        workSheet[`F${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}



        XLSX.utils.sheet_add_aoa(workSheet, [["", "DESCRIPCION", "CANTIDAD", "UNIDAD", "COSTO UNIT.", "COSTO TOTAL"]], {origin: `A${activeRow++}`});
        workSheet[`A${activeRow - 1}`].s = styles.tableHeader
        workSheet[`B${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'left', vertical: 'center'}}
        workSheet[`C${activeRow - 1}`].s = styles.tableHeader
        workSheet[`D${activeRow - 1}`].s = styles.tableHeader
        workSheet[`E${activeRow - 1}`].s = styles.tableHeader
        workSheet[`F${activeRow - 1}`].s = styles.tableHeader

        if(row.materialCosts.length !== 0){
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
            activeRow += row.materialCosts.length


            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "Subtotal de materiales", "", "", "", `${row.materialCost}`]], {origin: `A${activeRow++}`});
            workSheet[`B${activeRow - 1}`].s = styles.groupTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.groupTotal, alignment: {horizontal: 'right', vertical: 'center'}}

        }


        if(row.workForceCosts.length !== 0){
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
            activeRow += row.workForceCosts.length

            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "Subtotal de mano de obra", "", "", "", `${row.workForceCost}`]], {origin: `A${activeRow++}`});
            workSheet[`B${activeRow - 1}`].s = styles.groupTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.groupTotal, alignment: {horizontal: 'right', vertical: 'center'}}

        }


        if(row.directCost){
            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
            XLSX.utils.sheet_add_aoa(workSheet, [["", "TOTAL COSTOS DIRECTOS", "", "", "", `${row.directCost}`]], {origin: `A${activeRow++}`})
            workSheet[`A${activeRow - 1}`].s = styles.rowSubTotal
            workSheet[`B${activeRow - 1}`].s = styles.rowSubTotal
            workSheet[`F${activeRow - 1}`].s = {...styles.rowSubTotal,  alignment: {horizontal: 'right', vertical: 'center'}}
          }

        if(row.indirectCosts.length !== 0){
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

        }


            workSheet['!merges'] = [ ...workSheet['!merges'],
                                   { s: {r:activeRow - 1, c: 1}, e:{r:activeRow - 1, c:4}}]
                                                                                    XLSX.utils.sheet_add_aoa(workSheet, [["", "COSTO TOTAL RENGLON", "", "", "", `${row.totalCost || 0}`]], {origin: `A${activeRow++}`});
            workSheet[`A${activeRow - 1}`].s = styles.tableHeader
            workSheet[`B${activeRow - 1}`].s = styles.tableHeader
            workSheet[`F${activeRow - 1}`].s = {...styles.tableHeader, alignment: {horizontal: 'right', vertical: 'center'}}




    })

  console.log('presupuesto desglosado', await data);

  return setHeightRows(workSheet)



}





export {summaryWS, materialsWS, budgetWS}

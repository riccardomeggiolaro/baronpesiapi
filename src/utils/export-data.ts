import { createObjectCsvStringifier } from "csv-writer";
const exceljs = require("exceljs");

const exportData = (data) => {
  const onlyNameAndSymbolArr: Partial<any>[] = data.map(x => {
    const k = x as any;
    return {
      "Data": new Date(k.dt_create).toLocaleString(),
      "Codice carta": k.cardCode?.cardCode,
      "Targa": k.cardCode?.plate,
      "Ragione sociale": k.cardCode?.subjectId?.socialReason,
      "Pid1-Pid2": k.pid1 + "\n" + x.pid2,
      "Peso1": k.weight1,
      "Peso2": k.weight2,
      "Netto": k.netWeight,
      "Materiale": k.material,
      "Codice installazione": k.installationId?.installationCode,
      "Note1": k.note1,
      "Note2": k.note2
    }
  })
  return onlyNameAndSymbolArr;
}

export const exportXlsx = (data) => {
  const onlyNameAndSymbolArr = exportData(data);
  let workbook = new exceljs.Workbook();
  let worksheet = workbook.addWorksheet("Worksheet");
  let columns = data.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), [])  
  worksheet.columns = columns.map((el) => {
    return { header: el, key: el, width: 20 };
  });
  worksheet.addRows(onlyNameAndSymbolArr);
  return workbook;
};

export const exportCsv = (data) => {
  const onlyNameAndSymbolArr = exportData(data);
    const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'Data', title: 'Data' },
          { id: 'Codice carta', title: 'Codice carta' },
          { id: 'Targa', title: 'Targa' },
          { id: 'Ragione sociale', title: 'Ragione sociale' },
          { id: 'Pid1-Pid2', title: 'Pid1-Pid2' },
          { id: 'Peso1', title: 'Peso1' },
          { id: 'Peso2', title: 'Peso2' },
          { id: 'Netto', title: 'Netto' },
          { id: 'Materiale', title: 'Materiale' },
          { id: 'Codice installazione', title: 'Codice installazione' },
          { id: 'Note1', title: 'Note1' },
          { id: 'Note2', title: 'Note2' },
        ],
    });
    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(onlyNameAndSymbolArr);
    return csvString;
}  

export const exportPdf = (data) => {
  const pesate: any[] = data.map(x => {
    const k = x as any;
    return [
      new Date(k.dt_create).toLocaleString(),
      k.cardCode?.cardCode,
      k.cardCode?.plate,
      k.cardCode?.subjectId?.socialReason,
      k.pid1 + "\n" + x.pid2,
      k.weight1,
      k.weight2,
      k.netWeight,
      k.material,
      k.installationId?.installationCode,
      k.note1,
      k.note2
    ]
  })
  const table = { 
    title: '',
    headers: ["Data", "Codice Carta", "Targa", "Ragione Sociale", "Pid1/Pid2", "Peso1", "Peso2", "Peso Netto", "Materiale", "Codice Installazione", "Note1", "Note2"],
    datas: [],
    rows: pesate,
  };
  return table;
}
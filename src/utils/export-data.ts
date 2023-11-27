import { createObjectCsvStringifier } from "csv-writer";
const exceljs = require("exceljs");

const exportData = (data) => {
  const onlyNameAndSymbolArr: Partial<any>[] = data.map(x => {
    const k = x as any;
    return {
      "Data": new Date(k.dt_create).toLocaleString(),
      "Numero carta": k.cardCode?.numberCard,
      "Targa": k.cardCode?.plate,
      "Ragione sociale": k.cardCode?.subjectId?.socialReason,
      "Pid1": k.pid1,
      "Pid2": k.pid2,
      "Peso1": k.weight1,
      "Peso2": k.weight2,
      "Netto": k.netWeight,
      "Materiale": k.material,
      "Codice installazione": k.installationId?.installationCode,
      "Descrizione installazione": k.installationId?.description,
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
  let columns = onlyNameAndSymbolArr.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), [])  
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
          { id: 'Numero carta', title: 'Numero carta' },
          { id: 'Targa', title: 'Targa' },
          { id: 'Ragione sociale', title: 'Ragione sociale' },
          { id: 'Pid1', title: 'Pid1' },
          { id: 'Pid2', title: 'Pid2' },
          { id: 'Peso1', title: 'Peso1' },
          { id: 'Peso2', title: 'Peso2' },
          { id: 'Netto', title: 'Netto' },
          { id: 'Materiale', title: 'Materiale' },
          { id: 'Codice installazione', title: 'Codice installazione' },
          { id: 'Descrizione installazione', title: 'Descrizione installazione' },
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
      k.cardCode?.numberCard,
      k.cardCode?.plate,
      k.cardCode?.subjectId?.socialReason,
      k.pid1 + "\n" + x.pid2,
      k.weight1,
      k.weight2,
      k.netWeight,
      k.material,
      k.installationId?.installationCode,
      k.installationId?.description,
      k.note1,
      k.note2
    ]
  })
  const table = { 
    title: '',
    headers: ["Data", "Numero \nCarta", "Targa", "Ragione Sociale", "Pid 1\nPid 2", "Peso 1", "Peso 2", "Peso Netto", "Materiale", "Codice \nInstallazione", "Descrizione \ninstallazione", "Note 1", "Note 2"],
    datas: [],
    rows: pesate
  };
  return table;
}
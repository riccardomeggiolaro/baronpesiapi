import exceljs from "exceljs";
import { Parser } from "json2csv";

// Return an array of the modified past data in another format
const exportData = (data) => {
  // Each object returns in a different format
  const onlyNameAndSymbolArr: Partial<any>[] = data.map(x => {
    const k = x as any;
    return {
      "Progr": k.progressive,
      "Data": new Date(k.dt_create).toLocaleString(),
      "Numero carta": k.cardId?.numberCard,
      "Veicolo": k.vehicle,
      "Targa": k.plate,
      "Ragione sociale": k.subjectId?.socialReason,
      "Pid1": k.pid1,
      "Pid2": k.pid2,
      "Peso1": k.weight1,
      "Peso2": k.weight2,
      "Netto": k.netWeight,
      "Materiale": k.materialId?.description,
      "Installazione": k.installationId?.description,
    }
  })
  return onlyNameAndSymbolArr;
}

// Returns the data to an xlsx file
export const exportXlsx = (data) => {
  const onlyNameAndSymbolArr = exportData(data); // Change format of data
  let workbook = new exceljs.Workbook(); // Create a new workbook
  let worksheet = workbook.addWorksheet("Worksheet"); // Create a worksheet
  let columns = onlyNameAndSymbolArr.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), []) // For each key value pair of the objects add a column with key name
  worksheet.columns = columns.map((el) => {
    return { header: el, key: el, width: 20 };
  });
  worksheet.addRows(onlyNameAndSymbolArr); // For each object add a row to the worksheet
  return workbook; // Return file xlsx
};

// Returns the data to an csv file
export const exportCsv = (data) => {
  const onlyNameAndSymbolArr = exportData(data); // Change format of data
  const json2csvParser = new Parser(); // Create a new json to csv parser
  const csv = json2csvParser.parse(onlyNameAndSymbolArr); // Create a file csv with json to csv parser passing the data changed as parameters
  return csv; // Return file csv
}  

// Returns the data to an pdf file
export const exportPdf = (data) => {
  // Each object returns in a different format
  const pesate: any[] = data.map(x => {
    const k = x as any;
    return [
      k.progressive,
      new Date(k.dt_create).toLocaleString(),
      k.cardId?.numberCard || "",
      k.vehicle || "",
      k.plate || "",
      k.subjectId?.socialReason,
      (k.pid1 || "") + "\n" + (x.pid2 || ""),
      k.weight1 || "",
      k.weight2 || "",
      k.netWeight || "",
      k.materialId?.description,
      k.installationId?.description,
    ]
  })
  // Create an object with headers and data changed
  const table = { 
    title: '',
    headers: ["Progr", "Data", "Numero \nCarta", "Veicolo", "Targa", "Ragione Sociale", "Pid 1\nPid 2", "Peso 1", "Peso 2", "Peso Netto", "Materiale", "Installazione"],
    datas: [],
    rows: pesate
  };
  return table; // Return the object ready to be converted to pdf
}
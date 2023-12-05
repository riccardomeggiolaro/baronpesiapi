import exceljs from "exceljs";
import { Parser } from "json2csv";

// Return an array of the modified past data in another format
const exportData = (data) => {
  // Each object returns in a different format
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
      new Date(k.dt_create).toLocaleString(),
      k.cardCode?.numberCard || "",
      k.cardCode?.plate || "",
      k.cardCode?.subjectId?.socialReason || "",
      (k.pid1 || "") + "\n" + (x.pid2 || ""),
      k.weight1 || "",
      k.weight2 || "",
      k.netWeight || "",
      k.material || "",
      k.installationId?.installationCode || "",
      k.installationId?.description || "",
      k.note1 || "",
      k.note2 || ""
    ]
  })
  // Create an object with headers and data changed
  const table = { 
    title: '',
    headers: ["Data", "Numero \nCarta", "Targa", "Ragione Sociale", "Pid 1\nPid 2", "Peso 1", "Peso 2", "Peso Netto", "Materiale", "Codice \nInstallazione", "Descrizione \ninstallazione", "Note 1", "Note 2"],
    datas: [],
    rows: pesate
  };
  return table; // Return the object ready to be converted to pdf
}
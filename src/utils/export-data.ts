import exceljs from "exceljs";
import { Parser } from "json2csv";

// Returns the data to an xlsx file
export const exportXlsx = (data) => {
  let workbook = new exceljs.Workbook(); // Create a new workbook
  let worksheet = workbook.addWorksheet("Worksheet"); // Create a worksheet
  let columns = data.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), []) // For each key value pair of the objects add a column with key name
  worksheet.columns = columns.map((el) => {
    return { header: el, key: el, width: 20 };
  });
  worksheet.addRows(data); // For each object add a row to the worksheet
  return workbook; // Return file xlsx
};

// Returns the data to an csv file
export const exportCsv = (data) => {
  const json2csvParser = new Parser(); // Create a new json to csv parser
  const csv = json2csvParser.parse(data); // Create a file csv with json to csv parser passing the data changed as parameters
  return csv; // Return file csv
}  

// Returns the data to an pdf file
export const exportPdf = (headers, data) => {
  // Create an object with headers and data changed
  const table = { 
    title: '',
    headers: headers,
    datas: [],
    rows: data
  };
  return table; // Return the object ready to be converted to pdf
}
import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterEventDTO, IDEventDTO } from "./events.dto";
import EventService from "./events.services";
import { exportCsv, exportPdf, exportXlsx } from "../../utils/export-data";
import PDFDocument from "pdfkit-table";

export const listEvents = async (req: TypedRequest<any, FilterEventDTO>, res: Response, next: NextFunction) => {
    try{
        const events = await EventService.list(req.query, true); // Find events filtered
        return res.json(events);
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

// Return an array of the modified past data in another format
const exportableObjectEvents = (data) => {
  // Each object returns in a different format
  const onlyNameAndSymbolArr: Partial<any>[] = data.map(x => {
    const k = x as any;
    return {
      "Progr": k.progressive,
      "Data": new Date(k.dt_create).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' }),
      "Ora": new Date(k.dt_create).toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' }),
      "Numero carta": k.cardCode?.numberCard,
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

const exportableArrayEvents = (data) => {
  // Each object returns in a different format
  return data.map(x => {
    const k = x as any;
    return [
      k.progressive,
      new Date(k.dt_create).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' }),
      new Date(k.dt_create).toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' }),
      k.cardCode?.numberCard || "",
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
}

export const exportEvents = async (req: TypedRequest<any, FilterEventDTO>, res: Response, next: NextFunction) => {
    try{
        const event = await EventService.list(req.query, false); // Find events filtered
        if(req.params.type === "xlsx"){
            const data = exportableObjectEvents(event); // Create an array of object with values of each object
            const workbook = exportXlsx(data); // Create file xlsx
            // Set header response
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");
            // Response with xlsx file
            return workbook.xlsx.write(res).then(function () {
              res.status(200).end();
            });
        }else if(req.params.type === "csv"){
            const data = exportableObjectEvents(event); // Create an array of object with values of each object
            // Set header response
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            const csvString = exportCsv(data); // Create csv file
            return res.send(csvString); // Response with csv file
        }else if(req.params.type === "pdf"){
            const headers = ["Progr", "Data", "Ora", "Numero \nCarta", "Veicolo", "Targa", "Ragione Sociale", "Pid 1\nPid 2", "Peso 1", "Peso 2", "Peso Netto", "Materiale", "Installazione"];
            const data = exportableArrayEvents(event); // Create an array of array with values of each object
            const doc = new PDFDocument({ margin: 20, size: 'A4', layout: "landscape" }) // Create pdf file
            doc.pipe(res); // Add res to pdf file
            const table = exportPdf(headers, data) // Create data table
            await doc.table(table, { /* options */ });
            // Set header response
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'inline; filename="data.pdf"');
            doc.end(); // Response with end of file pdf
        }else{
            return res.json({message: "Tipo non supportato"}) // Return if type pass is mot supported
        }
    }catch(err){
        next(err) // Pass errors to the next middleware handler
    }
}

export const getOneEvent = async (req: TypedRequest<any, ParsedQs, IDEventDTO>, res: Response, next: NextFunction) => {
    try{
        const event = await EventService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id || null); // Get one event by id and installationId if there is
        return res.json(event);
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const deleteEvent = async (req: TypedRequest<any, ParsedQs, IDEventDTO>, res: Response, next: NextFunction) => {
    try{
        await EventService.delete(req.params.id); // Delete event by id and installationId if there is
        return res.json({message: `Evento ${req.params.id} eliminato`});
    }catch(err){
        next(err) // Pass errors to the next middleware handler
    }
}
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

export const exportEvents = async (req: TypedRequest<any, FilterEventDTO>, res: Response, next: NextFunction) => {
    try{
        const event = await EventService.list(req.query, false); // Find events filtered
        if(req.params.type === "xlsx"){
            const workbook = exportXlsx(event); // Create file xlsx
            // Set header response
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");
            // Response with xlsx file
            return workbook.xlsx.write(res).then(function () {
              res.status(200).end();
            });
        }else if(req.params.type === "csv"){
            // Set header response
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            const csvString = exportCsv(event); // Create csv file
            return res.send(csvString); // Response with csv file
        }else if(req.params.type === "pdf"){
            const doc = new PDFDocument({ margin: 20, size: 'A4', layout: "landscape" }) // Create pdf file
            doc.pipe(res); // Add res to pdf file
            const table = exportPdf(event) // Create data table
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
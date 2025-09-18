import { Response, NextFunction } from "express"
import { ParsedQs, TypedRequest } from "../../utils/typed-request.interface";
import { FilterCardDTO, IDCardDTO, UpdateCardDTO } from "./cards.dto";
import CardService from "./cards.services";
import { hasKeyValuePairs } from "../../utils/has-values-object";
import { exportCsv, exportPdf, exportXlsx } from "../../utils/export-data";
import PDFDocument from "pdfkit-table";

export const listCards = async (req: TypedRequest<any, FilterCardDTO>, res: Response, next: NextFunction) => {
    try{
        console.log(req.query)
        const filterParams: FilterCardDTO = req.query; // Extract filter parameters from the request query
        const cards = await CardService.list(filterParams); // Fetch cards using CardService.list, passing the filter parameters
        res.json(cards); // Return a successful response with the retrieved cards
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
};  

// Return an array of the modified past data in another format
const exportableObjectCards = (data) => {
  // Each object returns in a different format
  const onlyNameAndSymbolArr: Partial<any>[] = data.map(x => {
    const k = x as any;
    return {
        "Numero carta": k.numberCard,
        "Codice carta": k.cardCode,
        "Veicolo": k.vehicle,
        "Targa": k.plate,
        "Tara": k.tare,
        "Materiale": k.materialId?.description,
        "Ragione sociale": k.subjectId?.socialReason,
        "Installazione": k.installationId?.description,
    }
  })
  return onlyNameAndSymbolArr;
}

const exportableArrayCards = (data) => {
  // Each object returns in a different format
  return data.map(x => {
    const k = x as any;
    return [
        k.numberCard,
        k.cardCode,
        k.vehicle || "",
        k.plate || "",
        k.tare || "",
        k.materialId?.description,
        k.subjectId?.socialReason,
        k.installationId?.description,
    ]
  })
}

export const exportCards = async (req: TypedRequest<any, FilterCardDTO>, res: Response, next: NextFunction) => {
    try{
        const card = await CardService.list(req.query); // Find cards filtered
        if(req.params.type === "xlsx"){
            const data = exportableObjectCards(card); // Create an array of object with values of each object
            const workbook = exportXlsx(data); // Create file xlsx
            // Set header response
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");
            // Response with xlsx file
            return workbook.xlsx.write(res).then(function () {
              res.status(200).end();
            });
        }else if(req.params.type === "csv"){
            const data = exportableObjectCards(card); // Create an array of object with values of each object
            // Set header response
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            const csvString = exportCsv(data); // Create csv file
            return res.send(csvString); // Response with csv file
        }else if(req.params.type === "pdf"){
            const headers = ["Numero \nCarta", "Codice \nCarta", "Veicolo", "Targa", "Tara", "Materiale", "Ragione \nSociale", "Installazione"];
            const data = exportableArrayCards(card); // Create an array of array with values of each object
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

export const getOneCard = async (req: TypedRequest<any, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        const found = await CardService.getByIdAndInstallationWithError(req.params.id, req.user?.installationId?.id! || null); // Find one card by id and installationId if exist
        return res.json(found); // Return a successful response with card found
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}

export const updateCard = async (req: TypedRequest<UpdateCardDTO, ParsedQs, IDCardDTO>, res: Response, next: NextFunction) => {
    try{
        if(!await hasKeyValuePairs(req.body)) return res.json({message: "Niente da aggiornare"}); // Return if there isn't anything to update
        await CardService.update(req.params.id, req.body); // Update the card by id and installationId if exist
        return res.status(200).json({message: `Carta ${req.params.id} modificata con successo`}); // Return a successful response
    }catch(err){
        next(err); // Pass errors to the next middleware handler
    }
}
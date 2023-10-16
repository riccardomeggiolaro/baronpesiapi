export class JustExistsError extends Error {
    constructor(){
        super();
        this.name = 'JustExistsError';
    }
}

export async function CreateJustExistError(property: string){
    const error = new JustExistsError();
    error.message = `${property} già esistente`;
    throw error;
}
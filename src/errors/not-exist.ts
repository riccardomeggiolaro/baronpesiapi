export class NotExistsError extends Error {
    constructor(){
        super();
        this.name = 'NotExistsError';
    }
}

export async function CreateNotExistError(property: string){
    const error = new NotExistsError();
    error.message = `${property} non esistente`;
    throw error;
}
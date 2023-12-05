import { NotFoundError } from "../../errors/not-found";
import { FilterInstallationDTO, InstallationDTO } from "./installations.dto";
import { InstallationORM } from "./installation.entity";
import { Like } from "typeorm";

export class InstallationService {
    async add(newInstallation: InstallationDTO): Promise<InstallationORM | null>{
        const installation = new InstallationORM(); // Create new installation
        installation.installationCode = newInstallation.installationCode;
        installation.description = newInstallation.description;
        installation.imei = newInstallation.imei;
        const created = await installation.save(); // Save new installation
        // Check if installation was created
        if(!created){
            throw new NotFoundError();
        }
        return created;
    }

    async list(filter: FilterInstallationDTO): Promise<InstallationORM[] | []>{
        let q: object[] = [];
        let i = 0;
        // For each key value pair push a new object containg them into q
        Object.keys(filter).forEach(key => {
            if(i === 0){
                q.push({[key]: Like(`%${filter[key]}%`)});
            }else{
                q.push({[key]: Like(`%${filter[key]}%`)});
            }
            i++;
        });
        // Create query to find installations filtered
        const installations = await InstallationORM.find({
            where: q
        });
        // Check if there is at least one installation
        if(installations.length > 0){
            return installations;
        }
        return [];
    }

    async delete(id: number): Promise<void>{
        // Create query to delete installation by id
        const deleted = await InstallationORM.delete({id: id})
        // Check if subject was deleted
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<InstallationORM | null>{
        // Create query to get installation by id
        const installation = await InstallationORM.findOneBy({id: id});
        return installation;
    }

    async getByIdWithError(id: number): Promise<InstallationORM>{
        // Create query to get installation by id
        const installation = await InstallationORM.findOneBy({id: id});
        // Check if installation was found 
        if(!installation){
            throw new NotFoundError();
        }
        return installation;
    }

    async getByInstallationCode(code: string): Promise<InstallationORM | null>{
        // Create query to get installation by installation code
        const installation = await InstallationORM.findOneBy({installationCode: code});
        return installation;
    }

    async getByInstallationCodeWithError(code: string): Promise<InstallationORM | null>{
        // Create query to get installation by installation code
        const installation = await InstallationORM.findOneBy({installationCode: code});
        // Check if the installation was found
        if(!installation){
            throw new NotFoundError();
        }
        return installation;
    }

    async update(id: number, installation: object): Promise<void>{
        // Create query to update the installation by id and passing an object with parameters contains value to update
        const updated = await InstallationORM
        .createQueryBuilder()
        .update("installations")
        .set(installation)
        .where("id = :id", { id: id })
        .execute()
        // Check if installation was updated
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new InstallationService();
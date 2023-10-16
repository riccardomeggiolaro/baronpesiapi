import { NotFoundError } from "../../errors/not-found";
import { FilterInstallationDTO, InstallationDTO } from "./installations.dto";
import { InstallationORM } from "./installation.entity";
import { And, Like } from "typeorm";

export class InstallationService {
    async add(newInstallation: InstallationDTO): Promise<InstallationORM | null>{
        const installation = new InstallationORM();
        installation.installationCode = newInstallation.installationCode;
        installation.description = newInstallation.description;
        installation.imei = newInstallation.imei;
        const created = await installation.save();
        if(!created){
            throw new NotFoundError();
        }
        return created;
    }

    async list(filter: FilterInstallationDTO): Promise<InstallationORM[] | []>{
        let q: object[] = [];
        let i = 0;
        Object.keys(filter).forEach(key => {
            if(i === 0){
                q.push({[key]: Like(`%${filter[key]}%`)});
            }else{
                q.push({[key]: Like(`%${filter[key]}%`)});
            }
            i++;
        });
        const installations = await InstallationORM.find({
            where: q
        });
        if(installations.length > 0){
            return installations;
        }
        return [];
    }

    async delete(id: number): Promise<void>{
        const deleted = await InstallationORM.delete({id: id})
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<InstallationORM | null>{
        const installation = await InstallationORM.findOneBy({id: id});
        return installation;
    }

    async getByIdWithError(id: number): Promise<InstallationORM>{
        const installation = await InstallationORM.findOneBy({id: id});
        if(!installation){
            throw new NotFoundError();
        }
        return installation;
    }

    async getByInstallationCode(code: string): Promise<InstallationORM | null>{
        const installation = await InstallationORM.findOneBy({installationCode: code});
        return installation;
    }

    async getByInstallationCodeWithError(code: string): Promise<InstallationORM | null>{
        const installation = await InstallationORM.findOneBy({installationCode: code});
        if(!installation){
            throw new NotFoundError();
        }
        return installation;
    }

    async update(id: number, installation: object): Promise<void>{
        const updated = await InstallationORM
        .createQueryBuilder()
        .update("installations")
        .set(installation)
        .where("id = :id", { id: id })
        .execute()
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new InstallationService();
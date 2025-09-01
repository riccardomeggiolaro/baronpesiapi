import { SubjectORM } from "./subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { FilterSubjectDTO, SubjectDTO } from "./subjects.dto";
import { InstallationORM } from "../installation/installation.entity";

export class SubjectService {
    async add(newSubject: SubjectDTO): Promise<SubjectORM | null>{
        const subject = new SubjectORM(); // Create new subject
        subject.socialReason = newSubject.socialReason;
        subject.telephoneNumber = newSubject.telephoneNumber;
        subject.CFPIVA = newSubject.CFPIVA;
        const created = await subject.save(); // Save new subject
        // Check if the subject was created
        if(!created){
            throw new NotFoundError();
        }
        return created;
    }

    async list(filter: FilterSubjectDTO): Promise<SubjectORM[] | []>{
        const subjects = SubjectORM
            .createQueryBuilder("subjects")
            if(filter.socialReason) subjects.where("subjects.socialReason LIKE :socialReason", { socialReason: `${filter.socialReason}%` })
            if(filter.telephoneNumber) subjects.andWhere("subjects.telephoneNumber LIKE :telephoneNumber", { telephoneNumber: `${filter.telephoneNumber}%` })
            if(filter.CFPIVA) subjects.andWhere("subjects.CFPIVA LIKE :CFPIVA", { CFPIVA: `${filter.CFPIVA}%` })
        const result = await subjects.getMany()
        return result;
    }

    async delete(id: number): Promise<void>{
        // Create query to delete subject by id
        const q = {
            id: id
        }
        const deleted = await SubjectORM.delete(q)
        // Check if subject was deleted
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<SubjectORM | null>{
        // Create query to get subject by id
        const subjects = await SubjectORM.findOneBy({id: id});
        return subjects;
    }

    async getByIdWithError(id: number): Promise<SubjectORM>{
        // Create query to get subject by id
        const subject = await SubjectORM.findOneBy({id: id});
        // Check if subject was found 
        if(!subject){
            throw new NotFoundError();
        }
        return subject;
    }

    async getBySocialReason(socialReason: string): Promise<SubjectORM | null>{
        // Create query to get subject by social reason
        const subject = await SubjectORM.findOneBy({socialReason: socialReason});
        return subject;
    }

    async update(id: number, subject: object): Promise<void>{
        // Create query to update the subject by id and passing an object with parameters contains value to update
        const updated = SubjectORM
        .createQueryBuilder()
        .update("subjects")
        .set(subject)
        .where("id = :id", { id: id })
        const result = await updated.execute()
        // Check if subject was updated
        if(result.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new SubjectService();
import { SubjectORM } from "./subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import { And, Like } from "typeorm";

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

    async list(filter: UpdateSubjectDTO): Promise<SubjectORM[] | []>{
        let q: object[] = [];
        let i = 0;
        // For each key value pair push a new object containg them into q
        Object.keys(filter).forEach(key => {
            if(i === 0){
                q.push({[key]: Like(`%${filter[key]}%`)});
            }else{
                q.push({[key]: And(Like(`%${filter[key]}%`))});
            }
            i++;
        });
        // Create query to find cards filtered
        const subjects = await SubjectORM.find({
            where: q
        });
        // Check if there is at least one subject
        if(subjects.length > 0){
            return subjects;
        }
        return [];
    }

    async delete(id: number): Promise<void>{
        // Create query to delete subject by id
        const deleted = await SubjectORM.delete({id: id})
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
        const updated = await SubjectORM
        .createQueryBuilder()
        .update("subjects")
        .set(subject)
        .where("id = :id", { id: id })
        .execute()
        // Check if subject was updated
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new SubjectService();
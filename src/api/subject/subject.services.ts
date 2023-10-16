import { SubjectORM } from "./subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { SubjectDTO, UpdateSubjectDTO } from "./subjects.dto";
import { And, Like } from "typeorm";

export class SubjectService {
    async add(newSubject: SubjectDTO): Promise<SubjectORM | null>{
        const subject = new SubjectORM();
        subject.socialReason = newSubject.socialReason;
        subject.telephoneNumber = newSubject.telephoneNumber;
        subject.CFPIVA = newSubject.CFPIVA;
        const created = await subject.save();
        if(!created){
            throw new NotFoundError();
        }
        return created;
    }

    async list(filter: UpdateSubjectDTO): Promise<SubjectORM[] | []>{
        let q: object[] = [];
        let i = 0;
        Object.keys(filter).forEach(key => {
            if(i === 0){
                q.push({[key]: Like(`%${filter[key]}%`)});
            }else{
                q.push({[key]: And(Like(`%${filter[key]}%`))});
            }
            i++;
        });
        const subjects = await SubjectORM.find({
            where: q
        });
        if(subjects.length > 0){
            return subjects;
        }
        return [];
    }

    async delete(id: number): Promise<void>{
        const deleted = await SubjectORM.delete({id: id})
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<SubjectORM | null>{
        const subjects = await SubjectORM.findOneBy({id: id});
        return subjects;
    }

    async getByIdWithError(id: number): Promise<SubjectORM>{
        const subject = await SubjectORM.findOneBy({id: id});
        if(!subject){
            throw new NotFoundError();
        }
        return subject;
    }

    async getBySocialReason(socialReason: string): Promise<SubjectORM | null>{
        const subject = await SubjectORM.findOneBy({socialReason: socialReason});
        return subject;
    }

    async update(id: number, subject: object): Promise<void>{
        const updated = await SubjectORM
        .createQueryBuilder()
        .update("subjects")
        .set(subject)
        .where("id = :id", { id: id })
        .execute()
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new SubjectService();
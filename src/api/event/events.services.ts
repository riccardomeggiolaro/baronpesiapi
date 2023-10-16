import { NotFoundError } from "../../errors/not-found";
import { CardORM } from "../card/card.entity";
import { InstallationORM } from "../installation/installation.entity";
import { SubjectORM } from "../subject/subject.entity";
import { EventORM } from "./event.entity";
import { EventDTO, FilterEventDTO, UpdateEventDTO } from "./events.dto";

export class EventService {
    async add(newEvent: EventDTO): Promise<EventORM | null>{
        const event = new EventORM();
        event.installationId = newEvent.idInstallation;
        event.progressive = newEvent.progressive;
        event.dt_create = newEvent.dt_create;
        event.note1 = newEvent.note1;
        event.note2 = newEvent.note2;
        event.weight1 = newEvent.weight1;
        event.pid1 = newEvent.pid1;
        event.weight2 = newEvent.weight2;
        event.pid2 = newEvent.pid2;
        event.netWeight = newEvent.netWeight;
        event.cardCode = newEvent.cardCode;
        const created = await event.save();
        if(!created){
            throw new NotFoundError();
        }
        const eventCreated = await this.getByIdAndInstallationWithError(created.id, created.installationId || null)
        return eventCreated;
    }

    async list(q: FilterEventDTO): Promise<EventORM[] | []>{
        const events = EventORM
            .createQueryBuilder("events")
            .leftJoinAndMapOne("events.installationId", InstallationORM, "installations", "events.installationId = installations.id")
            .leftJoinAndMapOne("events.cardCode", CardORM, "cards", "events.cardCode = cards.cardCode")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            if(q.dtMin && !q.dtMax) events.where("events.dt_create > :dtMin", { dtMin: q.dtMin })
            if(!q.dtMin && q.dtMax) events.where("events.dt_create < :dtMax", { dtMax: q.dtMax })
            if(q.dtMin && q.dtMax) events.where("events.dt_create BETWEEN :dtMin AND :dtMax", { dtMin: q.dtMin, dtMax: q.dtMax })
            if(q.cardCode) events.andWhere("cards.cardCode LIKE :cardCode", { cardCode: `${q.cardCode}%` })
            if(q.plate) events.andWhere("cards.plate LIKE :plate", { plate: `${q.plate}%` })
            if(q.socialReason) events.andWhere("subjects.socialReason LIKE :socialReason", { socialReason: `${q.socialReason}%` })
            if(q.idInstallation) events.andWhere("events.installationId = :installationId", { installationId: q.idInstallation })
        const result = await events.getMany()
        return result;
    }

    async delete(id: number, installationId: number | null): Promise<void>{
        const q = {
            id: id
        }
        if(installationId) q["installationId"] = installationId
        const deleted = await EventORM.delete(q)
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getByIdAndInstallationWithError(id: number, installationId: number | null): Promise<EventORM>{
        const event = EventORM
            .createQueryBuilder("events")
            .leftJoinAndMapOne("events.installationId", InstallationORM, "installations", "events.installationId = installations.id")
            .leftJoinAndMapOne("events.cardCode", CardORM, "cards", "events.cardCode = cards.cardCode")
            .where("events.id = :id", { id: id });
        if(installationId !== null) event.andWhere("events.installationId = :installationId", { installationId: installationId })
        const result = await event.getOne()
        if(!result){
            throw new NotFoundError();
        }
        console.log(result)
        return result;
    }

    async update(id: number, subject: UpdateEventDTO): Promise<void>{
        const updated = await EventORM
        .createQueryBuilder()
        .update("events")
        .set(subject)
        .where("events.id = :id", { id })
        .execute()
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new EventService();
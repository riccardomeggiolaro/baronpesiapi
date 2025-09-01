import { NotFoundError } from "../../errors/not-found";
import { InstallationORM } from "../installation/installation.entity";
import { EventORM } from "./event.entity";
import { FilterEventDTO } from "./events.dto";
import { AppDataSource } from "../../app";
import { CardORM } from "../card/card.entity";
import { MaterialORM } from "../material/material.entity";
import { SubjectORM } from "../subject/subject.entity";

export class EventService {
    async list(q: FilterEventDTO, takeLimit: boolean): Promise<EventORM[] | []>{
        // Create query to find cards filtered
        const events = AppDataSource.getRepository(EventORM)
        .createQueryBuilder("events")
        .leftJoinAndMapOne("events.cardCode", CardORM, "cards", "events.cardCode = cards.cardCode")
        .leftJoinAndMapOne("events.materialId", MaterialORM, "materials", "events.materialId = materials.id")
        .leftJoinAndMapOne("events.subjectId", SubjectORM, "subjects", "events.subjectId = subjects.id")
        .leftJoinAndMapOne("events.installationId", InstallationORM, "installations", "events.installationId = installations.id")
        if(takeLimit) events.take(2000)
        if(q.dtMin && !q.dtMax) events.where("events.dt_create > :dtMin", { dtMin: q.dtMin })
        if(!q.dtMin && q.dtMax) events.where("events.dt_create < :dtMax", { dtMax: q.dtMax })
        if(q.dtMin && q.dtMax) events.where("events.dt_create BETWEEN :dtMin AND :dtMax", { dtMin: q.dtMin, dtMax: q.dtMax })
        if(q.cardCode) events.andWhere("cards.cardCode LIKE :cardCode", { cardCode: `${q.cardCode}%` })
        if(q.numberCard) events.andWhere("cards.numberCard LIKE :numberCard", { numberCard: `${q.numberCard}%` })
        if(q.plate) events.andWhere("events.plate LIKE :plate", { plate: `${q.plate}%` })
        if(q.materialDescription) events.andWhere("materials.description LIKE :description", { description: `${q.materialDescription}%` })
        if(q.note) events.andWhere("events.note LIKE :note", { note: `${q.note}%` } )
        if(q.socialReason) events.andWhere("subjects.socialReason LIKE :socialReason", { socialReason: `${q.socialReason}%` })
        if(q.installationId) events.andWhere("events.installationId = :installationId", { installationId: q.installationId })
        const result = await events.getMany()
        return result;
    }

    async delete(id: number): Promise<void>{
        // Create query to delete event by id 
        const deleted = await EventORM.delete({ id: id });
        // Check if the deletion was successful
        if (deleted.affected === 0) {
            throw new NotFoundError();
        }
    }

    async getByIdAndInstallationWithError(id: number, installationId: number | null): Promise<EventORM>{
        // Create query to get event by id and installationId
        const event = EventORM
            .createQueryBuilder("events")
            .leftJoinAndMapOne("events.installationId", InstallationORM, "installations", "events.installationId = installations.id")
            .where("events.id = :id", { id: id });
        // Check if installationId is different from null
        if(installationId !== null) event.andWhere("events.installationId = :installationId", { installationId: installationId })
        const result = await event.getOne()
        // Check if event was found
        if(!result){
            throw new NotFoundError();
        }
        return result;
    }
}

export default new EventService();
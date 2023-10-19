import { SubjectORM } from "../subject/subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { CardDTO, FilterCardDTO } from "./cards.dto";
import { CardORM } from "./card.entity";
import { InstallationORM } from "../installation/installation.entity";

export class CardService {
    async add(newCard: CardDTO): Promise<CardORM | null>{
        const card = new CardORM();
        card.cardCode = newCard.cardCode;
        card.vehicle = newCard.vehicle;
        card.plate = newCard.plate;
        card.tare = newCard.tare || 0;
        card.subjectId = newCard.idSubject;
        card.installationId = newCard.idInstallation;
        const created = await card.save();
        if(!created){
            throw new NotFoundError();
        }
        const cardCreated = await this.getByCardCodeWithError(created.cardCode)
        return cardCreated;
    }

    async list(q: FilterCardDTO): Promise<CardORM[] | []>{
        const cards = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            if(q.cardCode) cards.where("cards.cardCode LIKE :cardCode", { cardCode: `${q.cardCode}%` })
            if(q.vehicle) cards.andWhere("cards.vehicle LIKE :vehicle", { vehicle: `${q.vehicle}%` })
            if(q.plate) cards.andWhere("cards.plate LIKE :plate", { plate: `${q.plate}%` })
            if(q.socialReason) cards.andWhere("subjects.socialReason LIKE :socialReason", { socialReason: `${q.socialReason}%` })
            if(q.idInstallation && q.idInstallation["id"]) cards.andWhere("cards.installationId = :idInstallation", { idInstallation: q.idInstallation["id"] })
            if(q.idInstallation && typeof(q.idInstallation) === "number") cards.andWhere("cards.installationId = :idInstallation", { idInstallation: q.idInstallation })
        const result = await cards.getMany()
        return result;
    }

    async delete(id: number, installationId: number | null): Promise<void>{
        const q = {
            id: id
        }
        if(installationId !== null) q["installation"] = installationId
        const deleted = await CardORM.delete(q)
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<CardORM | null>{
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id })
            .getOne()
        return card
    }

    async getByIdAndInstallationWithError(id: number, installationId: number | null): Promise<CardORM>{
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        if(!result){
            throw new NotFoundError();
        }
        return result
    }

    async getByIdAndInstallation(id: number, installationId: number | null): Promise<CardORM | null>{
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        return result
    }

    async getByCardCode(cardCode: string): Promise<CardORM | null>{
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode })
            .getOne()
        return card;
    }

    async getByCardCodeWithError(cardCode: string): Promise<CardORM>{
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode })
            .getOne()
        if(!card){
            throw new NotFoundError()
        }
        return card;
    }

    async getByCardCodeAndInstallation(cardCode: string, installationId: number | null): Promise<CardORM | null>{
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        return result
    }

    async update(id: number, card: any): Promise<void>{
        const updated = await CardORM
        .createQueryBuilder()
        .update("cards")
        .set(card)
        .where("id = :id", { id: id })
        .execute()
        if(updated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new CardService();
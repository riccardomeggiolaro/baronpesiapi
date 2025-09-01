import { SubjectORM } from "../subject/subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { FilterCardDTO } from "./cards.dto";
import { CardORM } from "./card.entity";
import { InstallationORM } from "../installation/installation.entity";
import { MaterialORM } from "../material/material.entity";

export class CardService {    
    async list(q: FilterCardDTO): Promise<CardORM[] | []>{
        // Create query to find cards filtered
        const cards = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            if(q.numberCard) cards.where("cards.numberCard LIKE :numberCard", { numberCard: `${q.numberCard}%` })
            if(q.vehicle) cards.andWhere("cards.vehicle LIKE :vehicle", { vehicle: `${q.vehicle}%` })
            if(q.plate) cards.andWhere("cards.plate LIKE :plate", { plate: `${q.plate}%` })
            if(q.note) cards.andWhere("cards.note LIKE :note", { note: `${q.note}%` } )
            if(q.materialDescription) cards.andWhere("materials.description LIKE :description", { description: `${q.materialDescription}%` })
            if(q.socialReason) cards.andWhere("subjects.socialReason LIKE :socialReason", { socialReason: `${q.socialReason}%` })
            if(q.installationId) cards.andWhere("cards.installationId = :idInstallation", { idInstallation: q.installationId })
        const result = await cards.getMany()
        return result;
    }

    async delete(id: number): Promise<void>{
        const deleted = await CardORM.delete({ id: id }) // Delete the card by q params
        // Check if the card was deleted
        if(deleted.affected === 0){
            throw new NotFoundError();
        }
    }

    async getById(id: number): Promise<CardORM | null>{
        // Create query to select the card by id
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id })
            .getOne()
        return card
    }

    async getByIdAndInstallationWithError(id: number, installationId: number | null): Promise<CardORM>{
        // Create query to get the card by id and installation id
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        // Check if the card found
        if(!result){
            throw new NotFoundError();
        }
        return result
    }

    async getByIdAndInstallation(id: number, installationId: number | null): Promise<CardORM | null>{
        // Create query to get the card by id and installation
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.id = :id", { id: id });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        return result
    }

    async getByCardCode(cardCode: string): Promise<CardORM | null>{
        // Create query to get the card by cardCode
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode })
            .getOne()
        return card;
    }

    async getByNumberCard(numberCard: string): Promise<CardORM | null>{
        // Create query to get the card by numerCard
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.materialId", MaterialORM, "materials", "cards.materialId = materials.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.numberCard = :numberCard", { numberCard: numberCard })
            .getOne()
        return card;
    }

    async update(id: number, card: any): Promise<void>{
        // Create query to update the card by id and passing an object with parameters contains value to update
        const updated = CardORM
        .createQueryBuilder()
        .update("cards")
        .set(card)
        .where("id = :id", { id: id })
        // If installationId is different from null add parameter
        const cardUpdated = await updated.execute()
        // Check if the card was updated
        if(cardUpdated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new CardService();
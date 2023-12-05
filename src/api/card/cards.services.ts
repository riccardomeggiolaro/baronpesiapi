import { SubjectORM } from "../subject/subject.entity";
import { NotFoundError } from "../../errors/not-found";
import { CardDTO, FilterCardDTO } from "./cards.dto";
import { CardORM } from "./card.entity";
import { InstallationORM } from "../installation/installation.entity";

export class CardService {    
    async add(newCard: CardDTO): Promise<CardORM | null>{
        const card = new CardORM(); // Create new card
        card.cardCode = newCard.cardCode;
        card.numberCard = newCard.numberCard;
        card.vehicle = newCard.vehicle;
        card.plate = newCard.plate;
        card.tare = newCard.tare || 0;
        card.subjectId = newCard.idSubject;
        card.installationId = newCard.idInstallation;
        const created = await card.save(); // Save new card
        // Check if card was created
        if(!created){
            throw new NotFoundError();
        }
        const cardCreated = await this.getByCardCodeWithError(created.cardCode) // Check if card was created
        return cardCreated;
    }

    async list(q: FilterCardDTO): Promise<CardORM[] | []>{
        // Create query to find cards filtered
        const cards = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            if(q.numberCard) cards.where("cards.numberCard LIKE :numberCard", { numberCard: `${q.numberCard}%` })
            if(q.vehicle) cards.andWhere("cards.vehicle LIKE :vehicle", { vehicle: `${q.vehicle}%` })
            if(q.plate) cards.andWhere("cards.plate LIKE :plate", { plate: `${q.plate}%` })
            if(q.socialReason) cards.andWhere("subjects.socialReason LIKE :socialReason", { socialReason: `${q.socialReason}%` })
            if(q.idInstallation) cards.andWhere("cards.installationId = :idInstallation", { idInstallation: q.idInstallation })
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
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode })
            .getOne()
        return card;
    }

    async getByCardCodeWithError(cardCode: string): Promise<CardORM>{
        // Create query to get the card by cardCode
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode })
            .getOne()
        // Check if the card found
        if(!card){
            throw new NotFoundError()
        }
        return card;
    }

    async getByCardCodeAndInstallation(cardCode: string, installationId: number | null): Promise<CardORM | null>{
        // Create query to get the card by cardCode and installation
        const card = CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.cardCode = :cardCode", { cardCode: cardCode });
            if(installationId !== null) card.andWhere("cards.installationId = :installationId", { installationId: installationId })
        const result = await card.getOne()
        return result
    }

    async getByNumberCard(numberCard: string): Promise<CardORM | null>{
        // Create query to get the card by numerCard
        const card = await CardORM
            .createQueryBuilder("cards")
            .leftJoinAndMapOne("cards.subjectId", SubjectORM, "subjects", "cards.subjectId = subjects.id")
            .leftJoinAndMapOne("cards.installationId", InstallationORM, "installations", "cards.installationId = installations.id")
            .where("cards.numberCard = :numberCard", { numberCard: numberCard })
            .getOne()
        return card;
    }

    async update(id: number, installationId: number | null, card: any): Promise<void>{
        // Create query to update the card by id and passing an object with parameters contains value to update
        const updated = CardORM
        .createQueryBuilder()
        .update("cards")
        .set(card)
        .where("id = :id", { id: id })
        // If installationId is different from null add parameter
        if(installationId !== null){
            updated.andWhere("installationId = :installationId", { installationId: installationId })
        }
        const cardUpdated = await updated.execute()
        // Check if the card was updated
        if(cardUpdated.affected === 0){
            throw new NotFoundError();
        }
    }
}

export default new CardService();
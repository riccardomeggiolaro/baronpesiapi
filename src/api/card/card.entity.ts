import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, Index } from "typeorm";

// Create entity ORM to map the table cards
@Entity("cards")
export class CardORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({type: "varchar", length: 30, nullable: false})
    cardCode: string;

    @Column({type: "char", length: 5, nullable: false})
    numberCard: string;

    @Column({type: "varchar", length: 20, nullable: true})
    vehicle: string;

    @Column({type: "varchar", length: 10, nullable: true})
    plate: string;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'materialId' })
    materialId: number;

    @Column({type: "int", nullable: true})
    tare: number;

    @Column({type: "varchar", length: 30, nullable: true})
    note: string;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'subjectId' })
    subjectId: number | null;

    @Column({type: "int", nullable: false})
    @JoinColumn({ name: 'installationId' })
    installationId: number | null;  
}
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm"

// Create entity ORM to map the table subjects
@Entity("subjects")
export class SubjectORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({type: "varchar", length: 50, nullable: false})
    socialReason: string;

    @Column({type: "int", nullable: true})
    telephoneNumber: number;

    @Column({type: "varchar", length: 30, nullable: true})
    CFPIVA: string;
}
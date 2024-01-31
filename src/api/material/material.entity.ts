import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm"

// Create entity ORM to map the table subjects
@Entity("materials")
export class MaterialORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({type: "varchar", length: 30, nullable: false})
    description: string;
}
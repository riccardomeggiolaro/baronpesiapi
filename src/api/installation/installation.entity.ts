import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm"

// Create entity ORM to map the table installations
@Entity("installations")
export class InstallationORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 50, nullable: false})
    installationCode: string;

    @Column({type: "varchar", length: 50, nullable: false})
    description: string;

    @Index()
    @Column({type: "char", length:15, nullable: false})
    imei: string;
}
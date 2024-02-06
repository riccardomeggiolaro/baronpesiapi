import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Index, JoinColumn } from "typeorm"
import { InstallationORM } from "../installation/installation.entity";

// Create entity ORM to map the table users
@Entity("users")
export class UserORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column({type: "varchar", length: 50, nullable: false})
    username: string;

    @Column({type: "varchar", length: 255, nullable: false})
    hashedPassword: string;

    @Column({type: "int", nullable: false})
    accessLevel: number;

    @Column({type: "tinyint", default: 1, nullable: false})
    able: boolean;

    @Column({type: "datetime", nullable: true})
    lastAccess: Date;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'installationId' }) // Join on the categoryId column
    installationId: number | InstallationORM | null;
}

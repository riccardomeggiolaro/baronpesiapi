import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Index, JoinColumn } from "typeorm"

@Entity("users")
export class UserORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column({type: "varchar", length: 50})
    username: string;

    @Column({type: "varchar", length: 255})
    hashedPassword: string;

    @Column({type: "int", width: 11})
    accessLevel: number;

    @Column({type: "tinyint", default: 1})
    able: boolean;

    @Column({type: "datetime", nullable: true})
    lastAccess: Date;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'installationId' }) // Join on the categoryId column
    installationId: number | null;
}

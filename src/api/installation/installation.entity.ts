import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from "typeorm"

// Create entity ORM to map the table installations
@Entity("installations")
export class InstallationORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 50})
    installationCode: string

    @Column({type: "varchar", length: 50})
    description: string

    @Index()
    @Column({type: "char", length:15})
    imei: string
}

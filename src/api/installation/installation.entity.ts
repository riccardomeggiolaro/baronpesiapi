import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Index, OneToOne } from "typeorm"
import { UserORM } from "../user/user.entity";
import { EventORM } from "../event/event.entity";

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

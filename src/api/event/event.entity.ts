import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Index, JoinColumn } from "typeorm"
import { InstallationORM } from "../installation/installation.entity";
import { CardORM } from "../card/card.entity";

@Entity("events")
export class EventORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'installationId' })
    installationId: number | null;

    @Index()
    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    dt_insert: Date;

    @Index()
    @Column({type: "datetime"})
    dt_create: Date;

    @Column({type: "bigint"})
    progressive: number;

    @Column({type: "varchar", length: 50})
    note1: string;

    @Column({type: "varchar", length: 50})
    note2: string;

    @Column({type: "bigint", width: 20})
    weight1: number;

    @Column({type: "varchar", length: 12})
    pid1: string;

    @Column({type: "bigint", width: 20})
    weight2: number;

    @Column({type: "varchar", length: 12})
    pid2: number;

    @Column({type: "bigint", width: 20})
    netWeight: number;

    @Column({type: "char", length: 25})
    material: string;

    @Column({type: "varchar", length: 30, nullable: true})
    @JoinColumn({ name: 'cardCode' })
    cardCode: string

    @Column({type: "bigint", width: 20})
    rawid: number;
}
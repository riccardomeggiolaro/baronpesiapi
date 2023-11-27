import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, JoinColumn } from "typeorm";
import { CardORM } from "../card/card.entity";

@Entity("events", {orderBy: {
    dt_create: 'DESC'
}})
export class EventORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int", nullable: true})
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
    cardCode: string | CardORM;

    @Column({type: "bigint", width: 20})
    rawid: number;
}
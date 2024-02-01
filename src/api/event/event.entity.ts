import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, JoinColumn } from "typeorm";
import { CardORM } from "../card/card.entity";

// Create entity ORM to map the table events
@Entity("events", {orderBy: { dt_create: 'DESC' }})
export class EventORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
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

    @Column({type: "varchar", length: 30})
    cardCode: string | CardORM;

    @Index()
    @Column({type: "char", length: 4})
    numberCard: string;

    @Column({type: "varchar", length: 20})
    vehicle: string;

    @Index()
    @Column({type: "varchar", length: 10})
    plate: string;

    @Index()
    @Column({type: "varchar", length: 20})
    material: string;

    @Column({type: "varchar", length: 30})
    note: string;

    @Index()
    @Column({type: "varchar", length: 50})
    socialReason: string;

    @Column({type: "bigint", width: 20})
    @JoinColumn({ name: 'rawId' })
    rawid: number;
}
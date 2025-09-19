import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, JoinColumn } from "typeorm";
import { CardORM } from "../card/card.entity";
import { SubjectORM } from "../subject/subject.entity";
import { InstallationORM } from "../installation/installation.entity";
import { MaterialORM } from "../material/material.entity";

// Transformer per gestire il fuso orario
export class TimezoneTransformer {
    to(value: Date): Date {
        return value; // Non modificare quando salvi
    }

    from(value: Date): Date {
        if (!value) return value;
        // Aggiungi 2 ore quando leggi dal database
        return new Date(value.getTime() + (2 * 60 * 60 * 1000));
    }
}

// Create entity ORM to map the table events
@Entity("events", {orderBy: { dt_create: 'DESC' }})
export class EventORM extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP", transformer: new TimezoneTransformer()})
    dt_insert: Date;

    @Index()
    @Column({type: "datetime", nullable: true, transformer: new TimezoneTransformer()})
    dt_create: Date;

    @Column({type: "bigint", nullable: true})
    progressive: number;

    @Column({type: "bigint", nullable: true})
    weight1: number;

    @Column({type: "varchar", length: 12, nullable: true})
    pid1: string;

    @Column({type: "bigint", nullable: true})
    weight2: number;

    @Column({type: "varchar", length: 12, nullable: true})
    pid2: number;

    @Column({type: "bigint", nullable: true})
    netWeight: number;

    @Column({type: "varchar", length: 20, nullable: true})
    vehicle: string;

    @Index()
    @Column({type: "varchar", length: 10, nullable: true})
    plate: string;

    @Column({type: "varchar", length: 50, nullable: true})
    note: string;

    @Index()
    @Column({type: "varchar", nullable: true})
    @JoinColumn({ name: 'cardCode' })
    cardCode: string | CardORM | null;

    @Index()
    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'materialId' })
    materialId: number | MaterialORM | null;

    @Index()
    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'subjectId' })
    subjectId: number | SubjectORM | null;

    @Column({type: "bigint", width: 20, nullable: false})
    @JoinColumn({ name: 'rawid' })
    rawid: number;

    @Column({type: "int", nullable: true})
    @JoinColumn({ name: 'installationId' })
    installationId: number | InstallationORM | null;
}
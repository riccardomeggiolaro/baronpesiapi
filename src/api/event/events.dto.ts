import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { Exist } from "../../utils/validators/exist";

export class EventDTO {
    @IsInt()
    progressive: number

    @IsDate()
    @Type(() => Date)
    dt_create: Date

    @IsString()
    @MaxLength(50)
    @IsOptional()
    note1: string

    @IsString()
    @MaxLength(50)
    @IsOptional()
    note2: string

    @IsInt()
    weight1: number

    @IsString()
    @MaxLength(12)
    pid1: string

    @IsInt()
    weight2: number

    @IsString()
    @MaxLength(12)
    pid2: number

    @IsInt()
    netWeight: number

    @IsString()
    @Exist("cardCode", {message: "Codice carta non esistente"})
    cardCode: string;

    @IsOptional()
    @IsInt()
    @Exist("installation", {message: "Installazione non esistente"})
    idInstallation: number;
}

export class IDEventDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterEventDTO {
    @IsDate()
    @Type(() => Date)
    @IsOptional()    
    dtMin: Date

    @IsDate()
    @Type(() => Date)
    @IsOptional()    
    dtMax: Date

    @IsString()
    @IsOptional()
    cardCode: string
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string

    @IsString()
    @IsOptional()
    socialReason: string

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    idInstallation: number
}

export class UpdateEventDTO {
    @IsString()
    @MaxLength(50)
    @IsOptional()
    note1: string

    @IsString()
    @MaxLength(50)
    @IsOptional()
    note2: string

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    weight1: number

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    weight2: number

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    netWeight: number
}
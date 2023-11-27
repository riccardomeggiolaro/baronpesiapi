import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";
import { Exist } from "../../utils/validators/exist";

export class CardDTO {
    @IsString()
    @MaxLength(30)
    @JustExist("card", {message: "Codice carta già esistente"})
    cardCode: string

    @IsString()
    @MaxLength(4)
    @JustExist("numberCard", {message: "Numero carta già esistente"})
    numberCard: string
    
    @IsString()
    @MaxLength(20)
    vehicle: string
    
    @IsString()
    @MaxLength(10)
    plate: string
    
    @IsOptional()
    @IsInt()
    tare: number
    
    @IsInt()
    @Exist("subject", {message: "Soggetto non esistente"})
    idSubject: number

    @IsOptional()
    @IsInt()
    @Exist("installation", {message: "Installazione non esistente"})
    idInstallation: number;
}

export class IDCardDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterCardDTO {
    @IsString()
    @IsOptional()
    @MaxLength(4)
    numberCard: string;
    
    @IsString()
    @MaxLength(20)
    @IsOptional()
    vehicle: string
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string
    
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    tare: number

    @IsString()
    @IsOptional()
    socialReason: string;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    idInstallation: number;
}

export class UpdateCardDTO {
    @IsString()
    @MaxLength(30)
    @IsOptional()
    @JustExist("card", {message: "Codice carta già esistente"})
    cardCode: string

    @IsString()
    @MaxLength(4)
    @IsOptional()
    @JustExist("numberCard", {message: "Numero carta già esistente"})
    numberCard: string
    
    @IsString()
    @MaxLength(20)
    @IsOptional()
    vehicle: string
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string
    
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    tare: number
    
    @IsInt()
    @IsOptional()
    @Exist("subject", {message: "Soggetto non esistente"})
    subjectId: number

    @IsInt()
    @Type(() => Number)
    @Exist("installation", {message: "Installazione non esistente"})
    @IsOptional()
    installationId: number;
}
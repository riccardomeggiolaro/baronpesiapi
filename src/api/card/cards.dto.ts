import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Exist } from "../../utils/validators/exist";

export class IDCardDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterCardDTO {
    @IsString()
    @IsOptional()
    @MinLength(4)
    @MaxLength(5)
    numberCard: string;
    
    @IsString()
    @MaxLength(20)
    @IsOptional()
    vehicle: string;
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    materialDescription: number;

    @IsInt()
    @MaxLength(30)
    @IsOptional()
    @Type(() => Number)
    tare: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    note: string;

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
    @MaxLength(20)
    @IsOptional()
    vehicle: string;
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string;

    @IsInt()
    @IsOptional()
    @Exist("material", {message: "Materiale non esistente"})
    materialId: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    tare: number;

    @IsString()
    @IsOptional()
    @MaxLength(30)
    note: string;
    
    @IsInt()
    @IsOptional()
    @Exist("subject", {message: "Soggetto non esistente"})
    subjectId: number
}
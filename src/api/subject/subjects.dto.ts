import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";
import { NumberLength } from "../../utils/validators/number-length";

export class SubjectDTO {
    @IsString()
    @MaxLength(50)
    @JustExist("subject", {message: "Ragione sociale già esistente"})
    socialReason: string;

    @IsInt()
    @Type(() => Number)
    @NumberLength(9, { message: "Il numero di telefono deve avere massimo 9 numeri" })
    telephoneNumber: number;

    @IsString()
    @MaxLength(30)
    CFPIVA: string;
}

export class IDSubjectDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterSubjectDTO {
    @IsString()
    @MaxLength(50)
    @IsOptional()
    socialReason: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    telephoneNumber: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    CFPIVA: string;
}

export class UpdateSubjectDTO {
    @IsString()
    @MaxLength(50)
    @IsOptional()
    @JustExist("subject", {message: "Ragione sociale già esistente"})
    socialReason: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @NumberLength(9, { message: "Il numero di telefono deve avere massimo 9 numeri" })
    telephoneNumber: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    CFPIVA: string;
}
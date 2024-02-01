import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";

export class SubjectDTO {
    @IsString()
    @MaxLength(50)
    @JustExist("subject", {message: "Ragione sociale già assegnata all'installazione"})
    socialReason: string;

    @IsInt()
    @Type(() => Number)
    @Min(100000, {message: "Il recapito telefonico deve avere tra i 6 e 10 numeri"})
    @Max(9999999999, {message: "Il recapito telefonico deve avere tra i 6 e 10 numeri"})
    @IsOptional()
    telephoneNumber: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
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
    socialReason: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @Min(100000, {message: "Il recapito telefonico deve avere tra i 6 e 10 numeri"})
    @Max(9999999999, {message: "Il recapito telefonico deve avere tra i 6 e 10 numeri"})
    telephoneNumber: number;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    CFPIVA: string;
}
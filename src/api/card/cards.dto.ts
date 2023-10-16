import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";
import { Exist } from "../../utils/validators/exist";

export class CardDTO {
    @IsString()
    @MaxLength(30)
    @JustExist("card", {message: "Card code just exist"})
    cardCode: string
    
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
    @Exist("subject", {message: "Id subject to assign not exist"})
    idSubject: number

    @IsOptional()
    @IsInt()
    @Exist("installation", {message: "Id installation to assign not exist"})
    idInstallation: number;
}

export class IDCardDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterCardDTO {
    @IsString()
    @MaxLength(30)
    @IsOptional()
    cardCode: string
    
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
    @JustExist("card", {message: "Card code just exist"})
    cardCode: string
    
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
    @Exist("subject", {message: "New id subject to assign not exist"})
    idSubject: number

    @IsInt()
    @Type(() => Number)
    @Exist("installation", {message: "Id installation to assign not exist"})
    @IsOptional()
    idInstallation: number;
}
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

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
    @MaxLength(30)
    @IsOptional()
    cardCode: string

    @IsString()
    @MaxLength(4)
    @IsOptional()
    numberCard: string 
    
    @IsString()
    @MaxLength(10)
    @IsOptional()
    plate: string

    @IsString()
    @MaxLength(20)
    @IsOptional()
    materialDescription: string

    @IsString()
    @MaxLength(30)
    @IsOptional()
    note: string;

    @IsString()
    @IsOptional()
    socialReason: string

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    installationId: number
}
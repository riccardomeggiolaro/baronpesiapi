import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";

export class InstallationDTO {
    @IsString()
    @MaxLength(50)
    @JustExist("installation", {message: "Codice installazione già esistente"})
    installationCode: string;

    @IsString()
    @MaxLength(50)
    description: string;

    @IsString()
    @MaxLength(15)
    imei: string;
}

export class IDInstallationDTO{
    @IsNumber()
    @Type(() => Number)
    id: number;
}

export class FilterInstallationDTO {
    @IsString()
    @IsOptional()
    installationCode: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    imei: string;
}

export class UpdateDTO {
    @IsString()
    @MaxLength(50)
    @IsOptional()
    @JustExist("installation", {message: "Codice installazione già esistente"})
    installationCode: string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    description: string;

    @IsString()
    @MaxLength(15)
    @IsOptional()
    imei: string;
}
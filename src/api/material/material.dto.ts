import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { JustExist } from "../../utils/validators/just-exist";

export class MaterialDTO {
    @IsString()
    @MaxLength(30)
    @JustExist("material", { message: "Materiale già esistente" })
    description: string;
}

export class IDMaterialDTO{
    @IsInt()
    @Type(() => Number)
    id: number;
}

export class FilterMaterialDTO {
    @IsString()
    @MaxLength(30)
    @IsOptional()
    description: string;
}

export class UpdateMaterialDTO {
    @IsString()
    @MaxLength(30)
    @IsOptional()
    description: string;
}
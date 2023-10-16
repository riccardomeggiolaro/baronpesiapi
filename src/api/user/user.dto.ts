import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { IsSameThan } from "../../utils/validators/is-same-than";
import { Transform, Type } from "class-transformer";
import { Exist } from "../../utils/validators/exist";
import { IsDifferentFrom } from "../../utils/validators/is-different-from";
import { classicAdmin } from "../../global";

export class FilterUserDTO {
    @IsString()
    @IsOptional()
    username: string;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    idInstallation: number;
}

export class UsernameDTO {
    @IsString()
    username: string;
}

export class ExistUsernameTDO {
    @IsString()
    @Exist("username", {message: "Utente non esistente"})
    username: string;
}

export class UpdateUserDTO {
    @IsString()
    @MaxLength(30)
    @IsOptional()
    password: string;

    @IsBoolean()
    @IsOptional()
    @Transform((obj) => {
        if(obj.value === true) return true;
        if(obj.value === false) return false;
        return obj.value;
    })
    able: boolean;
}

export class UpdateLastAcces {
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    date: Date;
}

export class PasswordDTO {
    @IsString()
    oldPassword: string;

    @IsString()
    @MaxLength(30)
    @IsDifferentFrom('oldPassword', {
        message: "La nuova password deve essere diversa da quella vecchia"
    })
    newPassword: string;

    @IsString()
    @MaxLength(30)
    @IsSameThan('newPassword', {
        message: "La password ripetuta deve essere uguale alla nuova password"
    })
    repeatPassword: string;
}
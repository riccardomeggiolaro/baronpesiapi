import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { IsSameThan } from "../../utils/validators/is-same-than";
import { Transform, Type } from "class-transformer";
import { Exist } from "../../utils/validators/exist";
import { IsDifferentFrom } from "../../utils/validators/is-different-from";
import { classicAdmin } from "../../global";
import { JustExist } from "../../utils/validators/just-exist";
import { IsAssignableToAdmin } from "../../utils/validators/is-assignable-to-admin";
import * as gbl from "../../global";
import { ThereIsValueOptional } from "../../utils/validators/there-is-value-optional";

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
    @JustExist("username", {message: "Utente già esistente"})
    @MinLength(8)
    @IsOptional()
    username: string;
    
    @IsString()
    @MinLength(8)
    // @Matches(
    //   new RegExp('^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    //   {
    //     message: 'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special character'
    //   }
    // )
    @IsOptional()
    password: string;

    @IsNumber()
    @Min(1)
    @Max(gbl.classicAdmin)
    @IsAssignableToAdmin('installationId', { message: `L'installazione è da assegnare solo se il livello di accesso è minore di ${gbl.classicAdmin}` })
    @IsOptional()
    accessLevel: number;

    @IsNumber()
    @Exist("installation", {message: "Id installazione non esistente"})
    @ThereIsValueOptional("accessLevel", { message: "Per passare installationId devi passare anche l'accessLevel" })
    @IsOptional()
    installationId: number;

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
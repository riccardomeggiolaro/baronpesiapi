import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";
import * as gbl from "../../global";
import { IsAssignableToAdmin } from "../../utils/validators/is-assignable-to-admin";
import { JustExist } from "../../utils/validators/just-exist";
import { Exist } from "../../utils/validators/exist";

export class SigninUserDTO {  
    @IsString()
    @MinLength(8)
    @JustExist("username", {message: 'Utente già esistente'})
    username: string;
  
    @IsString()
    @MinLength(8)
    password: string;

    @IsNumber()
    @Min(1)
    @Max(gbl.classicAdmin)
    @IsAssignableToAdmin('idInstallation', { message: `L'installazione è da assegnare solo se il livello di accesso è minore di ${gbl.classicAdmin}` })
    accessLevel: number;

    @IsNumber()
    @Exist("installation", {message: "Installazione non esistente"})
    @IsOptional()
    idInstallation: number;
}

export class LoginUserDTO {
    @IsString()
    username: string;
  
    @IsString()
    password: string;
}

export class FirstUserDTO extends LoginUserDTO {
    constructor(){
        super();
    }
}
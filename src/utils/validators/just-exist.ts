import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { UserORM } from "../../api/user/user.entity";
import { InstallationORM } from "../../api/installation/installation.entity";
import UserService from "../../api/user/user.services";
import InstallationService from "../../api/installation/installations.services";
import SubjectService from "../../api/subject/subject.services";
import CardService from "../../api/card/cards.services";

export function JustExist(property: "username" | "installation" | "subject" | "card", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isJustExist',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            if(property === "username") {
              if(await UserService.getUserByUsername(value)) return false;
              return true;
            }else if(property === "installation") {
              if(await InstallationService.getByInstallationCode(value)) return false;
              return true;
            }else if(property === "subject") {
              if(await SubjectService.getBySocialReason(value)) return false;
              return true;
            }else{
              if(await CardService.getByCardCode(value)) return false;
              return true;
            }
          }
        },
      });
    };
}
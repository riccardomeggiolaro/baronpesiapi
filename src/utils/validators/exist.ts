import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import UserService from "../../api/user/user.services";
import InstallationService from "../../api/installation/installations.services";
import SubjectService from "../../api/subject/subject.services";
import CardService from "../../api/card/cards.services";

export function Exist(property: "username" | "installation" | "subject" | "card" | "cardCode", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isExist',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            if(property === "username") {
              if(await UserService.getUserByUsername(value)) return true;
              return false;
            }
            if(property === "installation") {
              if(await InstallationService.getById(value)) return true;
              return false;
            }
            if(property === "subject") {
              if(await SubjectService.getById(value)) return true;
              return false;
            }
            if(property === "card") {
              if(await CardService.getById(value)) return true;
              return false;
            }
            if(property === "cardCode") {
              if(await CardService.getByCardCode(value)) return true;
              return false;
            }
            return false;
          }
        },
      });
    };
  }
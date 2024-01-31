import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import UserService from "../../api/user/user.services";
import InstallationService from "../../api/installation/installations.services";
import SubjectService from "../../api/subject/subject.services";
import CardService from "../../api/card/cards.services";
import MaterialService from "../../api/material/material.services";

export function JustExist(property: "username" | "installationCode" | "installationDescription" | "subject" | "card" | "numberCard" | "material", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      // Register a custom validation decorator named 'isJustExist'
      registerDecorator({
        name: 'isJustExist',
        target: object.constructor, // The target class where the decorator is applied
        propertyName: propertyName, // The name of the property to be validated
        constraints: [], // No additional constraints are needed
        options: validationOptions, // Optional validation options
        validator: {
          async validate(value: any, args: ValidationArguments) {
            // Check the just existence of the value based on the specified property
            if(property === "username") {
              if(await UserService.getUserByUsername(value)) return false; // Check if the user just exist
              return true;
            }else if(property === "installationCode") {
              if(await InstallationService.getByInstallationCode(value)) return false; // Check if the installation just exist
              return true;
            }else if(property === "installationDescription") {
              if(await InstallationService.getByInstallationDescription(value)) return false; // Check if the installation just exist
              return true;
            }else if(property === "subject") {
              if(await SubjectService.getBySocialReason(value)) return false; // Check if the subject just exist
              return true;
            }else if(property === "card"){
              if(await CardService.getByCardCode(value)) return false; // Check if the card just exist by id
              return true;
            }else if(property === "numberCard"){
              if (await CardService.getByNumberCard(value)) return false; // Check if the card just exist by cardCode
              return true;
            }else if(property === "material"){
              if (await MaterialService.getByDescription(value)) return false;
              return true;
            }else{
              return false;
            }
          }
        },
      });
    };
}
import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import UserService from "../../api/user/user.services";
import InstallationService from "../../api/installation/installations.services";
import SubjectService from "../../api/subject/subject.services";
import MatrialService from "../../api/material/material.services";
import CardService from "../../api/card/cards.services";

export function Exist(property: "username" | "installation" | "subject" | "card" | "cardCode" | "material", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      // Register a custom validation decorator named 'isExist'
      registerDecorator({
        name: 'isExist',
        target: object.constructor, // The target class where the decorator is applied
        propertyName: propertyName, // The name of the property to be validated
        constraints: [], // No additional constraints are needed
        options: validationOptions, // Optional validation options
        validator: {
          // The custom validation logic using an async function
          async validate(value: any, args: ValidationArguments) {
            // Check the existence of the value based on the specified property
            if(property === "username") {
              if(await UserService.getUserByUsername(value)) return true; //Check if the user exist
              return false;
            }
            if(property === "installation") {
              if(await InstallationService.getById(value)) return true; // Check if the installation exist
              return false;
            }
            if(property === "subject") {
              if(await SubjectService.getById(value)) return true; // Check if the subject exist
              return false;
            }
            if(property === "material") {
              if(await MatrialService.getById(value)) return true; // Check if the subject exist
              return false;
            }
            if(property === "card") {
              if(await CardService.getById(value)) return true; // Check if the card exist by id
              return false;
            }
            if(property === "cardCode") {
              if(await CardService.getByCardCode(value)) return true; // Check if the card exist by cardCode
              return false;
            }
            return false;
          }
        },
      });
    };
  }
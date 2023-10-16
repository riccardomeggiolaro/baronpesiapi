import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import * as gbl from "../../global";

export function IsAssignableToAdmin(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isAssignableToAdmin',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [property] = args.constraints;
            const IdInstallation = (args.object as any)[property];
            if (value >= gbl.classicAdmin && !IdInstallation) return true
            else if (value >= gbl.classicAdmin && IdInstallation) return false
            else if(value < gbl.classicAdmin && IdInstallation) return true
            return false;
          }
        },
      });
    };
  }
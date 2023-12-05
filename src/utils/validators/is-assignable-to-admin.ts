import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import * as gbl from "../../global";

export function IsAssignableToAdmin(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    // Register a custom validation decorator named 'isAssignableToAdmin'
    registerDecorator({
      name: 'isAssignableToAdmin',
      target: object.constructor, // The target class where the decorator is applied
      propertyName: propertyName, // The name of the property to be validated
      constraints: [property], // The additional constraints are needed
      options: validationOptions, // Optional validation options
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the installation is assignable to the user
          const [property] = args.constraints; // Extract the property name from the constraints array
          const IdInstallation = (args.object as any)[property]; // Get the value of the property from the object
          if (value >= gbl.classicAdmin && !IdInstallation) return true; // If the role is higher than or equal to classic admin and there is no installation ID, it's assignable
          else if (value >= gbl.classicAdmin && IdInstallation) return false; // If the role is higher than or equal to classic admin and there is an installation ID, it's not assignable
          else if (value < gbl.classicAdmin && IdInstallation) return true; // If the role is lower than classic admin and there is an installation ID, it's assignable
          else return false;
        }
      },
    });
  };
}
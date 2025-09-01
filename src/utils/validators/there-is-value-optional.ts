import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function ThereIsValueOptional(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    // Register a custom validation decorator named 'thereIsValueOptional'
    registerDecorator({
      name: 'thereIsValueOptional',
      target: object.constructor, // The target class where the decorator is applied
      propertyName: propertyName, // The name of the property to be validated
      constraints: [property], // The additional constraints are needed
      options: validationOptions, // Optional validation options
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if an optional value was passed
          const [property] = args.constraints; // Get property passed
          const valueOptional = (args.object as any)[property]; // Get value of property passed
          if (valueOptional) return true // Check if there is a value of property passed
          return false;
        }
      },
    });
  };
}
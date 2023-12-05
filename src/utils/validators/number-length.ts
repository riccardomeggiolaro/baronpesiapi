import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function NumberLength(length: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      // Register a custom validation decorator named 'numberLength'
      registerDecorator({
        name: 'numberLength',
        target: object.constructor, // The target class where the decorator is applied
        propertyName: propertyName, // The name of the property to be validated
        constraints: [], // No additional constraints are needed
        options: validationOptions, // Optional validation options
        validator: {
          async validate(value: any, args: ValidationArguments) {
            // Check if the current length of current value is smaller or same than length pass as parameter
            return String(value).length <= length; // Check if the length of current value is ok
          }
        },
      });
    };
}
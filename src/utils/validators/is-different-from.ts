import { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { ValidationArguments } from "class-validator";

export function IsDifferentFrom(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    // Register a custom validation decorator named 'isDifferentFrom'
    registerDecorator({
      name: 'isDifferentFrom',
      target: object.constructor, // The target class where the decorator is applied
      propertyName: propertyName, // The name of the property to be validated
      constraints: [property], // The additional constraints are needed
      options: validationOptions, // Optional validation options
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the current value is different from a related value pass as parameter
          const [relatedPropertyName] = args.constraints; // Get name of related property pass as parameter
          const relatedValue = (args.object as any)[relatedPropertyName]; // Get value of related property name pass as paramter
          return relatedValue !== value ? true: false; // Check if current value is different from value of related property name pass as parameter
        }
      },
    });
  };
}
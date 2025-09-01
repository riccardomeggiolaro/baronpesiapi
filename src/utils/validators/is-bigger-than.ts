import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBiggerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    // Register a custom validation decorator named 'isBiggerThan'
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor, // The target class where the decorator is applied
      propertyName: propertyName, // The name of the property to be validated
      constraints: [property], // The additional constraints are needed
      options: validationOptions, // Optional validation options
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the current value is bigger than a related value pass as parameter
          const [relatedPropertyName] = args.constraints; // Get name of related property pass as parameter
          const relatedValue = (args.object as any)[relatedPropertyName]; // Get value of related property pass as parameter
          return relatedValue !== undefined ? relatedValue < value : true; // Check if current value is bigger than value of related property name pass as parameter
        }
      },
    });
  };
}
import { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { ValidationArguments } from "class-validator";

export function IsDifferentFrom(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDifferentFrom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return relatedValue !== value ? true: false;
        }
      },
    });
  };
}

import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function ThereIsValueOptional(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'thereIsValueOptional',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [property] = args.constraints;
            const valueOptional = (args.object as any)[property];
            if (valueOptional) return true
            return false;
          }
        },
      });
    };
  }
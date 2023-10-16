import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function NumberLength(length: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'numberLength',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            return String(value).length <= length;
          }
        },
      });
    };
}
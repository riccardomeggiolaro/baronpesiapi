import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBiggerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return relatedValue !== undefined ? relatedValue < value : true;
        }
      },
    });
  };
}

// FOR TO USE
// @IsGreateThan('[name_value]', { message: '[current_value] value must to be greater then [name_value]' })

//[name_value] = name of other params of current class to validate
//[current_value] = name of current params of current class to validate
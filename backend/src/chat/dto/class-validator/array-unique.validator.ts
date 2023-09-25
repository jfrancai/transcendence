import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';
import { ValidationOptions } from 'joi';

@ValidatorConstraint({ name: 'arrayUnique', async: false })
export class ArrayUniqueValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.length === new Set(value).size;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must contian only unique elements.`;
  }
}

export function IsArrayUnique(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ArrayUniqueValidator
    });
  };
}

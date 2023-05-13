import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isForeignKeyValidator } from '../prisma/prisma';

export function IsForeignKeyValid(
  tableName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [tableName],
      validator: IsForeignKeyValidator,
    });
  };
}

@ValidatorConstraint({ name: 'IsForeignKeyValid' })
export class IsForeignKeyValidator implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [tableName] = args.constraints;
    return await isForeignKeyValidator(tableName, value);
  }
}

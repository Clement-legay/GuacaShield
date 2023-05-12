import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    const { password, passwordConfirmation } = value;
    return password === passwordConfirmation;
  }

  defaultMessage() {
    return 'Password and confirmation do not match.';
  }
}
export class UsersCreateDto {
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  phone: string;
  @ApiProperty()
  @IsStrongPassword()
  password: string;
  @ApiProperty()
  @Validate(PasswordMatchValidator)
  passwordConfirmation: string;
}
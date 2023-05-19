import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from "../../customOperators/match.decorator";

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
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
}

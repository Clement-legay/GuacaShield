import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from '../../customDecorators/match.decorator';

export class UsersUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsStrongPassword()
  @IsOptional()
  password: string;
  @ApiProperty()
  @IsOptional()
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
}

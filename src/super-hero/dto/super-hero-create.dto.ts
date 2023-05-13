import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from '../../customDecorators/match.decorator';

export class SuperHeroCreateDto {
  @ApiProperty()
  @IsString()
  pseudo: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsStrongPassword()
  password: string;
  @ApiProperty()
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  phone: string;
  @ApiProperty()
  @IsDateString()
  birthday: Date;
  @ApiProperty()
  @IsString()
  latitude: string;
  @ApiProperty()
  @IsString()
  longitude: string;
}

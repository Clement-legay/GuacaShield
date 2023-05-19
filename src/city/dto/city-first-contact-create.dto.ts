import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Min,
} from 'class-validator';
import { Match } from '../../customOperators/match.decorator';

export class CityFirstContactCreateDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsStrongPassword()
  password: string;
  @ApiProperty()
  @IsString()
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
  @ApiProperty()
  @IsString()
  longitude: string;
  @ApiProperty()
  @IsString()
  latitude: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  job: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  phone: string;
}

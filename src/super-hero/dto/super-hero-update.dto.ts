import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from '../../customDecorators/match.decorator';

export class SuperHeroUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  pseudo: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
  @ApiProperty()
  @IsStrongPassword()
  @IsOptional()
  password: string;
  @ApiProperty()
  @IsOptional()
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthday: Date;
  @ApiProperty()
  @IsString()
  @IsOptional()
  latitude: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  longitude: string;
}

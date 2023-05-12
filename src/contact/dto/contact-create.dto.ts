import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Validate } from 'class-validator';
import { IsForeignKeyValidator } from '../../prisma/prisma';

export class ContactCreateDto {
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
  @ApiProperty()
  @Validate(IsForeignKeyValidator)
  cityId: number;
}

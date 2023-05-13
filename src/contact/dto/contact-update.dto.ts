import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
export class ContactUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  job: string;
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty()
  @IsPhoneNumber('FR')
  @IsOptional()
  phone: string;
}

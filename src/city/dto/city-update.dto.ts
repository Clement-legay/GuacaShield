import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Match } from '../../customDecorators/match.decorator';

export class CityUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsStrongPassword()
  @IsOptional()
  password: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Match('password', { message: 'Password and confirmation do not match.' })
  passwordConfirmation: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  longitude: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  latitude: string;
}

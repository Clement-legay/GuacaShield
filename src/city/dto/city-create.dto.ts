import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';
import { Match } from '../../customOperators/match.decorator';

export class CityCreateDto {
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
}

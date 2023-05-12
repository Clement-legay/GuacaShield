import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CityCreateDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  longitude: string;
  @ApiProperty()
  @IsString()
  latitude: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CityUpdateDto {
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

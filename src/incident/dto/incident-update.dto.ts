import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Validate } from 'class-validator';
import { IsForeignKeyValidator } from '../../prisma/prisma';

export class IncidentUpdateDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  latitude: string;
  @ApiProperty()
  @IsString()
  longitude: string;
  @ApiProperty()
  @IsNumber()
  @Validate(IsForeignKeyValidator, ['IncidentType'])
  typeId: number;
}

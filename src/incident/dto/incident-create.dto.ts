import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsForeignKeyValid } from '../../customOperators/foreignkey-validity.decorator';

export class IncidentCreateDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsForeignKeyValid('City', { message: 'City not found' })
  cityId: number;
  @ApiProperty()
  @IsString()
  latitude: string;
  @ApiProperty()
  @IsString()
  longitude: string;
  @ApiProperty()
  @IsForeignKeyValid('IncidentType', { message: 'Incident type not found' })
  typeId: number;
}

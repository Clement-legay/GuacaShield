import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsForeignKeyValid } from '../../customDecorators/foreignkey-validity.decorator';

export class IncidentUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  latitude: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  longitude: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsForeignKeyValid('IncidentType', { message: 'City not found' })
  typeId: number;
}

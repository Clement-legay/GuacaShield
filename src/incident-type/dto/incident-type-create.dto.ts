import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IncidentTypeCreateDto {
  @ApiProperty()
  @IsString()
  name: string;
}

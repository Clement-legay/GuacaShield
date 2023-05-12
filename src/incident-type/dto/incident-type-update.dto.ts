import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IncidentTypeUpdateDto {
  @ApiProperty()
  @IsString()
  name: string;
}

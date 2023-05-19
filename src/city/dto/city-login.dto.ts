import { IsString } from 'class-validator';

export class CityLoginDto {
  @IsString()
  identifier: string;
  @IsString()
  password: string;
}

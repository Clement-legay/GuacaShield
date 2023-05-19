import { IsString } from 'class-validator';

export class SuperHeroLoginDto {
  @IsString()
  identifier: string;
  @IsString()
  password: string;
}

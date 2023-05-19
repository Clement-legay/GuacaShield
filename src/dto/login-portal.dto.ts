import { IsString } from 'class-validator';

export class LoginPortalDto {
  @IsString()
  identifier: string;
}

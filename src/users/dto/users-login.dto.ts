import { IsString } from 'class-validator';

export class UsersLoginDto {
  @IsString()
  identifier: string;
  @IsString()
  password: string;
}

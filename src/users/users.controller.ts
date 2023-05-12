import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  // return json array of users
  async findAll() {
    return await this.usersService.findAll();
  }
}

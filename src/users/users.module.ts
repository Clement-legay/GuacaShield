import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Prisma],
})
export class UsersModule {}

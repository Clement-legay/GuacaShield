import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Prisma } from '../prisma/prisma';
import { UsersFrontController } from './users-front.controller';

@Module({
  controllers: [UsersController, UsersFrontController],
  providers: [UsersService, Prisma],
})
export class UsersModule {}

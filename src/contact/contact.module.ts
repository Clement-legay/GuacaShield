import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [ContactController],
  providers: [ContactService, Prisma],
})
export class ContactModule {}

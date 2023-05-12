import { Module } from '@nestjs/common';
import { SuperHeroService } from './super-hero.service';
import { SuperHeroController } from './super-hero.controller';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [SuperHeroController],
  providers: [SuperHeroService, Prisma],
})
export class SuperHeroModule {}

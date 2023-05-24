import { Module } from '@nestjs/common';
import { SuperHeroService } from './super-hero.service';
import { SuperHeroController } from './super-hero.controller';
import { Prisma } from '../prisma/prisma';
import { SuperHeroFrontController } from './super-hero-front.controller';

@Module({
  controllers: [SuperHeroController, SuperHeroFrontController],
  providers: [SuperHeroService, Prisma],
})
export class SuperHeroModule {}

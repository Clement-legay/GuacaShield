import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { Prisma } from '../prisma/prisma';
import { CityFrontController } from './city-front.controller';

@Module({
  controllers: [CityController, CityFrontController],
  providers: [CityService, Prisma],
})
export class CityModule {}

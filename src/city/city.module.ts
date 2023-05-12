import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [CityController],
  providers: [CityService, Prisma],
})
export class CityModule {}

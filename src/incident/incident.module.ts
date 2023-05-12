import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [IncidentController],
  providers: [IncidentService, Prisma],
})
export class IncidentModule {}

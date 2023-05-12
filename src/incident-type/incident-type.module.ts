import { Module } from '@nestjs/common';
import { IncidentTypeService } from './incident-type.service';
import { IncidentTypeController } from './incident-type.controller';
import { Prisma } from '../prisma/prisma';

@Module({
  controllers: [IncidentTypeController],
  providers: [IncidentTypeService, Prisma],
})
export class IncidentTypeModule {}

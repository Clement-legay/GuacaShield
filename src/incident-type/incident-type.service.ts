import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IncidentTypeCreateDto } from './dto/incident-type-create.dto';

@Injectable()
export class IncidentTypeService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.incidentType.findMany();
  }
  async findOne(id: number) {
    return this.prisma.incidentType.findUnique({
      where: { id: id },
    });
  }
  async create(data: IncidentTypeCreateDto) {
    return this.prisma.incidentType.create({
      data,
    });
  }
  async update(id: number, data: IncidentTypeCreateDto) {
    return this.prisma.incidentType.update({
      where: { id: id },
      data,
    });
  }
  async delete(id: number) {
    const incidents = await this.prisma.incident.findMany({
      where: { typeId: id },
    });
    if (incidents.length < 1) {
      return this.prisma.incidentType.delete({
        where: { id: id },
      });
    }
  }
}

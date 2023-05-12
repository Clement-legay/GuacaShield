import { Injectable } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import { IncidentCreateDto } from "./dto/incident-create.dto";

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.incident.findMany();
  }
  async findOne(id: number) {
    return this.prisma.incident.findUnique({
      where: { id: id },
    });
  }
  async create(data: IncidentCreateDto) {
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.create({
      data: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
    });
    return this.prisma.incident.create({
      data: {
        ...data,
        status: 'pending',
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: IncidentCreateDto) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: id },
    });
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.update({
      where: { id: incident.coordinatesId },
      data: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
    });
    return this.prisma.incident.update({
      where: { id: id },
      data: {
        ...data,
        coordinatesId: coordinates.id,
      },
    });
  }
  async delete(id: number) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: id },
      include: {
        HeroToIncident: true,
      },
    });
    if (incident.HeroToIncident.length < 1) {
      return this.prisma.incident.delete({
        where: { id: id },
      });
    }
  }
}

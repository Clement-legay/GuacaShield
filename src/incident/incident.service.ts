import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IncidentCreateDto } from './dto/incident-create.dto';
import { IncidentUpdateDto } from './dto/incident-update.dto';

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.incident.findMany();
  }
  async findAllPaged(page: number, rows: number) {
    return this.prisma.incident.findMany({
      skip: (page - 1) * rows,
      take: rows,
    });
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
        title: data.title,
        description: data.description,
        cityId: data.cityId,
        typeId: data.typeId,
        status: 'pending',
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: IncidentUpdateDto) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: id },
    });
    if (data.latitude && data.longitude) {
      const { latitude, longitude } = data;
      await this.prisma.coordinates.update({
        where: { id: incident.coordinatesId },
        data: {
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
        },
      });
    }
    return this.prisma.incident.update({
      where: { id: id },
      data: {
        title: data.title ?? incident.title,
        description: data.description ?? incident.description,
        typeId: data.typeId ?? incident.typeId,
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
    if (!incident || incident.HeroToIncident.length > 0) return null;
    await this.prisma.incident.delete({
      where: { id: id },
    });
    await this.prisma.coordinates.delete({
      where: { id: incident.coordinatesId },
    });
    return incident;
  }
}

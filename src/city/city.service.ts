import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CityCreateDto } from './dto/city-create.dto';
import { CityUpdateDto } from './dto/city-update.dto';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.city.findMany();
  }
  async findOne(id: number) {
    return this.prisma.city.findUnique({
      where: { id: id },
    });
  }
  async create(data: CityCreateDto) {
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    return this.prisma.city.create({
      data: {
        name: data.name,
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: CityUpdateDto) {
    const city = await this.prisma.city.findUnique({
      where: { id: id },
    });
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.update({
      where: { id: city.coordinatesId },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    return this.prisma.city.update({
      where: { id: id },
      data: {
        name: data.name,
        coordinatesId: coordinates.id,
      },
    });
  }
  async delete(id: number) {
    const city = await this.prisma.city.findUnique({
      where: { id: id },
    });
    await this.prisma.coordinates.delete({
      where: { id: city.coordinatesId },
    });
    return this.prisma.city.delete({
      where: { id: id },
    });
  }
}

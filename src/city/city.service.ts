import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CityCreateDto } from './dto/city-create.dto';
import { CityUpdateDto } from './dto/city-update.dto';
import * as bcrypt from 'bcrypt';

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
    const salt = await bcrypt.genSalt(5);
    data.password = await bcrypt.hash(data.password, salt);
    return this.prisma.city.create({
      data: {
        name: data.name,
        password: data.password,
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: CityUpdateDto) {
    const city = await this.prisma.city.findUnique({
      where: { id: id },
    });
    if (data.latitude && data.longitude) {
      const { latitude, longitude } = data;
      await this.prisma.coordinates.update({
        where: { id: city.coordinatesId },
        data: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });
    }
    if (data.password) {
      const salt = await bcrypt.genSalt(5);
      city.password = await bcrypt.hash(data.password, salt);
    }
    city.name = data.name ?? city.name;
    return this.prisma.city.update({
      where: { id: id },
      data: {
        ...city,
      },
    });
  }
  async delete(id: number) {
    const city = await this.prisma.city.delete({
      where: { id: id },
    });
    if (!city) return null;
    await this.prisma.coordinates.delete({
      where: { id: city.coordinatesId },
    });
    return city;
  }
}

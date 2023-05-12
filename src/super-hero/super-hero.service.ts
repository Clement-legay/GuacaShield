import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SuperHeroCreateDto } from './dto/super-hero-create.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class SuperHeroService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.superHero.findMany();
  }
  async findOne(id: number) {
    return this.prisma.superHero.findUnique({
      where: { id: id },
    });
  }
  async create(data: SuperHeroCreateDto) {
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.create({
      data: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
    });
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return this.prisma.superHero.create({
      data: {
        ...data,
        password: hashedPassword,
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: SuperHeroCreateDto) {
    const superHero = await this.prisma.superHero.findUnique({
      where: { id: id },
    });
    const { latitude, longitude } = data;
    await this.prisma.coordinates.update({
      where: { id: superHero.coordinatesId },
      data: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
    });
    if (data.password) {
      const salt = await bcrypt.genSalt(5);
      data.password = await bcrypt.hash(data.password, salt);
    }
    superHero.password = data.password || superHero.password;
    superHero.pseudo = data.pseudo || superHero.pseudo;
    superHero.firstName = data.firstName || superHero.firstName;
    superHero.lastName = data.lastName || superHero.lastName;
    superHero.email = data.email || superHero.email;
    superHero.phone = data.phone || superHero.phone;
    superHero.birthday = data.birthday || superHero.birthday;
    return this.prisma.superHero.update({
      where: { id: id },
      data: {
        ...superHero,
      },
    });
  }
  async delete(id: number) {
    const superHero = await this.prisma.superHero.findUnique({
      where: { id: id },
    });
    await this.prisma.coordinates.delete({
      where: { id: superHero.coordinatesId },
    });
    return this.prisma.superHero.delete({
      where: { id: id },
    });
  }
}

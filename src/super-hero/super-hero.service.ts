import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SuperHeroCreateDto } from './dto/super-hero-create.dto';
import { SuperHeroUpdateDto } from './dto/super-hero-update.dto';
import * as bcrypt from 'bcrypt';
import { SuperHeroLoginDto } from './dto/super-hero-login.dto';
import { JwtService } from '@nestjs/jwt';
import { calculateDistance } from '../customOperators/distanceCalculator.method';

@Injectable()
export class SuperHeroService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}
  async findAll() {
    return this.prisma.superHero.findMany();
  }
  async findOne(id: number) {
    return this.prisma.superHero.findUnique({
      where: { id: id },
      include: { Coordinates: true },
    });
  }
  async findHeroTypes(id: number) {
    return this.prisma.heroToType.findMany({
      where: { superHeroId: id },
      include: { IncidentType: true },
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
        pseudo: data.pseudo,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        birthday: new Date(data.birthday),
        coordinatesId: coordinates.id,
      },
    });
  }
  async update(id: number, data: SuperHeroUpdateDto) {
    const superHero = await this.prisma.superHero.findUnique({
      where: { id: id },
    });
    if (data.latitude && data.longitude) {
      const { latitude, longitude } = data;
      await this.prisma.coordinates.update({
        where: { id: superHero.coordinatesId },
        data: {
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
        },
      });
    }
    if (data.password) {
      const salt = await bcrypt.genSalt(5);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return this.prisma.superHero.update({
      where: { id: id },
      data: {
        pseudo: data.pseudo ?? superHero.pseudo,
        firstName: data.firstName ?? superHero.firstName,
        lastName: data.lastName ?? superHero.lastName,
        phone: data.phone ?? superHero.phone,
        email: data.email ?? superHero.email,
        password: data.password ?? superHero.password,
        birthday: data.birthday ? new Date(data.birthday) : superHero.birthday,
      },
    });
  }
  async delete(id: number) {
    const superHero = await this.prisma.superHero.findUnique({
      where: { id: id },
    });
    const user = await this.prisma.superHero.delete({
      where: { id: id },
    });
    await this.prisma.coordinates.delete({
      where: { id: superHero.coordinatesId },
    });
    return user;
  }
  async login(data: SuperHeroLoginDto) {
    const superHero = data.identifier.includes('@')
      ? await this.prisma.superHero.findUnique({
          where: { email: data.identifier },
          include: { Coordinates: true },
        })
      : await this.prisma.superHero.findUnique({
          where: { pseudo: data.identifier },
          include: { Coordinates: true },
        });
    const isMatch = await bcrypt.compare(data.password, superHero.password);
    if (!isMatch) return null;
    if (superHero.valid) {
      const payload = {
        id: superHero.id,
        pseudo: superHero.pseudo,
        email: superHero.email,
        phone: superHero.phone,
        birthday: superHero.birthday,
        coordinates: superHero.Coordinates,
        type: 'hero',
      };
      return {
        valid: true,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return { valid: false };
    }
  }
  async getHandledIncidents(id: number) {
    return this.prisma.incident.findMany({
      where: {
        HeroToIncident: { some: { superHeroId: id } },
      },
      include: {
        HeroToIncident: {
          include: {
            Incident: {
              include: {
                City: true,
                IncidentType: true,
                Coordinates: true,
              },
            },
          },
        },
      },
    });
  }
  async getMatchingIncidents(id: number, types) {
    const hero = await this.prisma.superHero.findUnique({
      where: { id: id },
      include: { Coordinates: true },
    });
    const matchingIncidents = await this.prisma.incident.findMany({
      where: {
        typeId: { in: types.map((type) => type.id) },
      },
      include: {
        Coordinates: true,
        IncidentType: true,
      },
    });
    const nearIncidents = [];
    for (const incident of matchingIncidents) {
      if (
        calculateDistance(
          incident.Coordinates.latitude,
          incident.Coordinates.longitude,
          hero.Coordinates.latitude,
          hero.Coordinates.longitude,
        ) <= 50
      ) {
        nearIncidents.push(incident);
      }
    }
    return nearIncidents;
  }
  async getIncidentTypes() {
    return this.prisma.incidentType.findMany();
  }
  async setHeroTypes(id: number, types: number[]) {
    const hero = await this.prisma.superHero.findUnique({
      where: { id: id },
    });
    await this.prisma.heroToType.deleteMany({
      where: { superHeroId: id },
    });
    const heroToType = types.map((type) => ({
      superHeroId: hero.id,
      incidentTypeId: parseInt(type.toString()),
    }));
    return this.prisma.heroToType.createMany({
      data: heroToType,
    });
  }
}

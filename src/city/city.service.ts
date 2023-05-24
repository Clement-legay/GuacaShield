import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CityCreateDto } from './dto/city-create.dto';
import { CityUpdateDto } from './dto/city-update.dto';
import * as bcrypt from 'bcrypt';
import { CityFirstContactCreateDto } from './dto/city-first-contact-create.dto';
import { CityLoginDto } from './dto/city-login.dto';
import { JwtService } from '@nestjs/jwt';
import { IncidentCreateDto } from '../incident/dto/incident-create.dto';
import { calculateDistance } from "../customOperators/distanceCalculator.method";

@Injectable()
export class CityService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}
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
  async createWithContact(data: CityFirstContactCreateDto) {
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    const salt = await bcrypt.genSalt(5);
    data.password = await bcrypt.hash(data.password, salt);
    const city = await this.prisma.city.create({
      data: {
        name: data.name,
        password: data.password,
        coordinatesId: coordinates.id,
      },
    });
    await this.prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        job: data.job,
        cityId: city.id,
      },
    });
    return city;
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
  async login(data: CityLoginDto) {
    const city = await this.prisma.city.findUnique({
      where: { name: data.identifier },
      include: { Coordinates: true },
    });
    if (!city) return null;
    const match = await bcrypt.compare(data.password, city.password);
    if (!match) return null;
    if (city.valid) {
      const payload = {
        id: city.id,
        name: city.name,
        coordinates: city.Coordinates,
        type: 'city',
      };
      return {
        valid: true,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return { valid: false };
    }
  }
  async getIncidents(id: number) {
    return this.prisma.incident.findMany({
      where: { cityId: id },
      include: {
        Coordinates: true,
        City: true,
        IncidentType: true,
        HeroToIncident: {
          include: {
            SuperHero: true,
          },
        },
      },
    });
  }
  async getContacts(id: number) {
    return this.prisma.contact.findMany({
      where: { cityId: id },
    });
  }
  async getAllIncidentTypes() {
    return this.prisma.incidentType.findMany();
  }
  async declareIncident(data: IncidentCreateDto) {
    const { latitude, longitude } = data;
    const coordinates = await this.prisma.coordinates.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    return this.prisma.incident.create({
      data: {
        title: data.title,
        description: data.description,
        coordinatesId: coordinates.id,
        typeId: parseInt(String(data.typeId)),
        cityId: parseInt(String(data.cityId)),
        status: 'pending',
      },
    });
  }
  async getNearHeroes(id: number) {
    const city = await this.prisma.city.findUnique({
      where: { id: id },
      include: { Coordinates: true },
    });
    const heroes = this.prisma.superHero.findMany({
      where: { valid: true },
      include: { Coordinates: true },
    });
    const nearHeroes = [];
    for (const hero of await heroes) {
      if (
        calculateDistance(
          city.Coordinates.latitude,
          city.Coordinates.longitude,
          hero.Coordinates.latitude,
          hero.Coordinates.longitude,
        ) <= 125
      ) {
        nearHeroes.push(hero);
      }
    }
    return nearHeroes;
  }
}

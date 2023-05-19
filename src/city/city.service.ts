import { Injectable, Req } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CityCreateDto } from "./dto/city-create.dto";
import { CityUpdateDto } from "./dto/city-update.dto";
import * as bcrypt from "bcrypt";
import { CityFirstContactCreateDto } from "./dto/city-first-contact-create.dto";
import { CityLoginDto } from "./dto/city-login.dto";
import { JwtService } from "@nestjs/jwt";

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
      const payload = { name: city.name, coordinates: city.Coordinates };
      return {
        valid: true,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return { valid: false };
    }
  }
}

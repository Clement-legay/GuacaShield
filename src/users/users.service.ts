import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersCreateDto } from './dto/users-create.dto';
import { UsersUpdateDto } from './dto/users-update.dto';
import * as bcrypt from 'bcrypt';
import { UsersLoginDto } from './dto/users-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}
  async findAll() {
    return this.prisma.user.findMany();
  }
  async findAllIncidentsPaged(page: number, rows: number) {
    return this.prisma.incident.findMany({
      skip: (page - 1) * rows,
      take: rows,
    });
  }
  async findAllHeroesPaged(page: number, rows: number) {
    return this.prisma.superHero.findMany({
      skip: (page - 1) * rows,
      take: rows,
    });
  }
  async findAllCitiesPaged(page: number, rows: number) {
    return this.prisma.city.findMany({
      skip: (page - 1) * rows,
      take: rows,
    });
  }
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user === null) return null;
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }
  async create(data: UsersCreateDto) {
    const salt = await bcrypt.genSalt(5);
    data.password = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
    });
  }
  async update(id: number, data: UsersUpdateDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user === null) return null;
    if (data.password) {
      const salt = await bcrypt.genSalt(5);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return this.prisma.user.update({
      where: { id: id },
      data: {
        firstName: data.firstName ?? user.firstName,
        lastName: data.lastName ?? user.lastName,
        email: data.email ?? user.email,
        phone: data.phone ?? user.phone,
        password: data.password ?? user.password,
      },
    });
  }
  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user === null) return null;
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
  async login(data: UsersLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.identifier },
    });
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) return null;
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      type: 'admin',
    };
    return {
      valid: true,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

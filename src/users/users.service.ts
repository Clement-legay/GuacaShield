import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { UsersCreateDto } from './dto/users-create.dto';
import { UsersUpdateDto } from './dto/users-update.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }
  async create(data: UsersCreateDto): Promise<User> {
    const salt = await bcrypt.genSalt(5);
    data.password = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data,
    });
  }
  async update(id: number, data: UsersUpdateDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (data.password) {
      const salt = await bcrypt.genSalt(5);
      data.password = await bcrypt.hash(data.password, salt);
    }
    user.password = data.password || user.password;
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.email = data.email || user.email;
    user.phone = data.phone || user.phone;
    return this.prisma.user.update({
      where: { id: id },
      data: {
        ...user,
      },
    });
  }
  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}

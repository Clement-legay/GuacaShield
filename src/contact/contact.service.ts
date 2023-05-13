import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaClient) {}
  async findAll() {
    return this.prisma.contact.findMany();
  }
  async findOne(id: number) {
    return this.prisma.contact.findUnique({
      where: { id: id },
      include: {
        City: true,
      },
    });
  }
  async create(data: ContactCreateDto) {
    return this.prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        job: data.job,
        cityId: data.cityId,
      },
    });
  }
  async update(id: number, data: ContactUpdateDto) {
    const contact = await this.prisma.contact.findUnique({
      where: { id: id },
    });
    return this.prisma.contact.update({
      where: { id: id },
      data: {
        firstName: data.firstName ?? contact.firstName,
        lastName: data.lastName ?? contact.lastName,
        email: data.email ?? contact.email,
        phone: data.phone ?? contact.phone,
        job: data.job ?? contact.job,
      },
    });
  }
  async delete(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id: id },
    });
    const contacts = await this.prisma.contact.findMany({
      where: { cityId: contact.cityId },
    });
    if (contacts.length > 1) {
      return this.prisma.contact.delete({
        where: { id: id },
      });
    }
  }
}

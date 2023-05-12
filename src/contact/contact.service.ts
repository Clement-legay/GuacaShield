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
      data,
    });
  }
  async update(id: number, data: ContactUpdateDto) {
    return this.prisma.contact.update({
      where: { id: id },
      data,
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

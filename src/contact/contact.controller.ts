import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactCreateDto } from './dto/contact-create.dto';
import { ContactUpdateDto } from './dto/contact-update.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}
  @ApiOperation({ summary: 'Get all contacts' })
  @Get()
  async findAll() {
    return this.contactService.findAll();
  }
  @ApiOperation({ summary: 'Get one contact' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.contactService.findOne(id);
    if (!result) {
      throw new NotFoundException('Contact not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Create a new Contact' })
  @Post()
  async create(@Body() data: ContactCreateDto) {
    return this.contactService.create(data);
  }
  @ApiOperation({ summary: 'Update a contact' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ContactUpdateDto,
  ) {
    const result = await this.contactService.update(id, data);
    if (!result) {
      throw new NotFoundException('Contact not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Delete a contact' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.contactService.delete(id);
    if (!result) {
      throw new NotFoundException('Contact not found');
    }
    return result;
  }
}

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
import { IncidentTypeService } from './incident-type.service';
import { IncidentTypeCreateDto } from './dto/incident-type-create.dto';
import { IncidentTypeUpdateDto } from './dto/incident-type-update.dto';

@ApiTags('incident-type')
@Controller('incident-type')
export class IncidentTypeController {
  constructor(private IncidentTypeService: IncidentTypeService) {}
  @ApiOperation({ summary: 'Get all incident types' })
  @Get()
  async findAll() {
    return this.IncidentTypeService.findAll();
  }
  @ApiOperation({ summary: 'Get one incident type' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.IncidentTypeService.findOne(id);
    if (!result) {
      throw new NotFoundException('Incident Type not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Create an incident type' })
  @Post()
  async create(@Body() data: IncidentTypeCreateDto) {
    return this.IncidentTypeService.create(data);
  }
  @ApiOperation({ summary: 'Update an incident type' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: IncidentTypeUpdateDto,
  ) {
    const result = await this.IncidentTypeService.update(id, data);
    if (!result) {
      throw new NotFoundException('Incident Type not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Delete an incident type' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.IncidentTypeService.delete(id);
    if (!result) {
      throw new NotFoundException('Incident Type not found');
    }
    return result;
  }
}

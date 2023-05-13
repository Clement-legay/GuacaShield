import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IncidentService } from './incident.service';
import { IncidentCreateDto } from "./dto/incident-create.dto";
import { IncidentUpdateDto } from "./dto/incident-update.dto";

@ApiTags('incident')
@Controller('incident')
export class IncidentController {
  constructor(private incidentService: IncidentService) {}
  @ApiOperation({ summary: 'Get all incidents' })
  @Get()
  async findAll() {
    return this.incidentService.findAll();
  }
  @ApiOperation({ summary: 'Get one incident' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.incidentService.findOne(id);
    if (!result) {
      throw new NotFoundException('Incident not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Create an incident' })
  @Post()
  async create(@Body() data: IncidentCreateDto) {
    return this.incidentService.create(data);
  }
  @ApiOperation({ summary: 'Update an incident' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: IncidentUpdateDto,
  ) {
    const result = await this.incidentService.update(id, data);
    if (!result) {
      throw new NotFoundException('Incident not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Delete an incident' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.incidentService.delete(id);
    if (!result) {
      throw new NotFoundException('Incident not found');
    }
    return result;
  }
}

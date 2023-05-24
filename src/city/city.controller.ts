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
  Res,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { CityCreateDto } from './dto/city-create.dto';
import { CityUpdateDto } from './dto/city-update.dto';
import { RedirectExceptionFilter } from '../customOperators/global-exception.filter';
import { CityFirstContactCreateDto } from './dto/city-first-contact-create.dto';

@ApiTags('city')
@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @ApiOperation({ summary: 'Get all city' })
  @Get()
  // return json array of city
  async findAll() {
    return this.cityService.findAll();
  }

  @ApiOperation({ summary: 'Get one city' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.cityService.findOne(id);
    if (!result) {
      throw new NotFoundException('City not found');
    }
    return result;
  }

  @ApiOperation({ summary: 'Create a new city' })
  @Post()
  async create(@Body() data: CityCreateDto) {
    return this.cityService.create(data);
  }

  @Post('join')
  @UseFilters(new RedirectExceptionFilter())
  async join(@Body() data: CityFirstContactCreateDto, @Res() res) {
    const result = await this.cityService.createWithContact(data);
    if (!result) {
      throw new NotFoundException("City couldn't be created");
    }
    return res.redirect('/town/confirmation');
  }

  @ApiOperation({ summary: 'Update a city' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CityUpdateDto,
  ) {
    const result = await this.cityService.update(id, data);
    if (!result) {
      throw new NotFoundException('City not found');
    }
    return result;
  }

  @ApiOperation({ summary: 'Delete a city' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.cityService.delete(id);
    if (!result) {
      throw new NotFoundException('City not found');
    }
    return result;
  }
}

import {
  BadRequestException,
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
import { SuperHeroService } from './super-hero.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuperHeroCreateDto } from './dto/super-hero-create.dto';
import { SuperHeroUpdateDto } from './dto/super-hero-update.dto';
import { RedirectExceptionFilter } from '../customOperators/global-exception.filter';
import { SuperHeroLoginDto } from './dto/super-hero-login.dto';

@ApiTags('super-hero')
@Controller('super-hero')
export class SuperHeroController {
  constructor(private superHeroService: SuperHeroService) {}
  @ApiOperation({ summary: 'Get all super heroes' })
  @Get()
  async findAll() {
    return this.superHeroService.findAll();
  }
  @ApiOperation({ summary: 'Get one super hero' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.superHeroService.findOne(id);
    if (!result) {
      throw new NotFoundException('Super Hero not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Create a super hero' })
  @Post()
  async create(@Body() data: SuperHeroCreateDto) {
    return this.superHeroService.create(data);
  }
  @Post('join')
  @UseFilters(new RedirectExceptionFilter())
  async join(@Body() data: SuperHeroCreateDto, @Res() res) {
    const result = await this.superHeroService.create(data);
    if (!result) {
      throw new NotFoundException("Super couldn't be created");
    }
    return res.redirect('/hero/confirmation');
  }
  @ApiOperation({ summary: 'Update a super hero' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: SuperHeroUpdateDto,
  ) {
    const result = await this.superHeroService.update(id, data);
    console.log('passed');
    if (!result) {
      throw new NotFoundException('Super Hero not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Delete a super hero' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.superHeroService.delete(id);
    if (!result) {
      throw new NotFoundException('Super Hero not found');
    }
    return result;
  }
}

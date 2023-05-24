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
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersCreateDto } from './dto/users-create.dto';
import { UsersUpdateDto } from './dto/users-update.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  // return json array of users
  async findAll() {
    return this.usersService.findAll();
  }
  @ApiOperation({ summary: 'Get one users' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.findOne(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Create one users' })
  @Post()
  async create(@Body() data: UsersCreateDto) {
    return this.usersService.create(data);
  }
  @ApiOperation({ summary: 'Update one users' })
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UsersUpdateDto,
  ) {
    const result = await this.usersService.update(id, data);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
  @ApiOperation({ summary: 'Delete one users' })
  @Delete(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.delete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
}

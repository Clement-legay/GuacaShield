import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RedirectExceptionFilter } from '../customOperators/global-exception.filter';
import { UsersLoginDto } from './dto/users-login.dto';
import { Roles } from '../customOperators/roles.decorator';
import { AuthGuard } from '../customOperators/auth.guard';

@Controller('admin')
export class UsersFrontController {
  constructor(private usersService: UsersService,) {}

  @Post('login')
  @UseFilters(RedirectExceptionFilter)
  async login(
    @Body() data: UsersLoginDto,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    const result = await this.usersService.login(data);
    if (!result) {
      throw new BadRequestException(['Account not found']);
    }
    req.session.access_token = result.access_token;
    res.cookie('access_token', result.access_token);
    return res.redirect('/admin/dashboard');
  }
  @Get()
  @Render('Admin/dashboard')
  @Roles('admin')
  @UseGuards(AuthGuard)
  dashboard(@Req() req) {
    const { page = 1, rows = 10 } = req.query;
    const incidents = this.usersService.findAllIncidentsPaged(page, rows);
    return { title: 'Dashboard', incidents };
  }
}

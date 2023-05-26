import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { RedirectExceptionFilter } from './customOperators/global-exception.filter';
import { LoginPortalDto } from './dto/login-portal.dto';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseFilters(RedirectExceptionFilter)
  @Post('login')
  @Render('loginPages/loginForm')
  async portalCheck(@Body() data: LoginPortalDto) {
    const user = await this.appService.findOneByEmail(data);
    if (!user) {
      throw new BadRequestException(['identifier not found']);
    }
    return { title: 'Login', user };
  }
  @Get('notfound')
  @Render('shared/notfound')
  notFound() {
    return { title: 'Not Found' };
  }
  @Get('error')
  @Render('shared/error')
  error() {
    return { title: 'Error' };
  }
  @Get('login')
  @Render('loginPages/portalEmail')
  portal(@Query('fv') formValues: string) {
    if (formValues) {
      const values = JSON.parse(
        Buffer.from(formValues, 'base64').toString('utf-8'),
      );
      return { title: 'Connexion Portal', formValues: values };
    }
    return { title: 'Connexion Portal' };
  }
  @Get()
  @Render('home/index')
  root() {
    return { title: 'Home' };
  }
  @Get('about')
  @Render('home/about')
  about() {
    return { title: 'About' };
  }
  @Get('logout')
  @Redirect('/', 302)
  async logout(@Req() req, @Res() res) {
    await this.appService.logout(req, res);
  }
  @Get('image/:name')
  @UsePipes(RedirectExceptionFilter)
  getImage(@Param('name') name, @Res() res) {
    res.sendFile(`${name}.png`, { root: './public/image/marker' });
  }
}

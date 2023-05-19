import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  UseFilters, UseGuards
} from "@nestjs/common";
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { RedirectExceptionFilter } from './customOperators/global-exception.filter';
import { LoginPortalDto } from './dto/login-portal.dto';
import { Roles } from './customOperators/roles.decorator';
import { AuthGuard } from "./customOperators/auth.guard";

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
  @Render('Shared/notfound')
  notFound() {
    return { title: 'Not Found' };
  }
  @Get('error')
  @Render('Shared/error')
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
  @Get('town/map')
  @Render('City/mapPage')
  @UseGuards(AuthGuard)
  cityMap() {
    return { title: 'Map' };
  }
  @Get(['/hero/confirmation', '/town/confirmation'])
  @Render('Shared/confirmationPage')
  confirmation() {
    return { title: 'Confirmation' };
  }
  @Get('about')
  @Render('home/about')
  about() {
    return { title: 'About' };
  }

  @Get('hero/join')
  @Render('SuperHero/joinPage')
  heroJoin(@Query('fv') formValues: string) {
    if (formValues) {
      const values = JSON.parse(
        Buffer.from(formValues, 'base64').toString('ascii'),
      );
      return { title: 'Join', formValues: values };
    }
    return { title: 'Join' };
  }

  @Get('town/join')
  @Render('City/joinPage')
  cityJoin(@Query('fv') formValues: string) {
    if (formValues) {
      const values = JSON.parse(
        Buffer.from(formValues, 'base64').toString('ascii'),
      );
      return { title: 'Join', formValues: values };
    }
    return { title: 'Join' };
  }
}

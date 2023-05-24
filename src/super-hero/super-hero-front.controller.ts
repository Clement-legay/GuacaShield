import { SuperHeroService } from './super-hero.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { RedirectExceptionFilter } from '../customOperators/global-exception.filter';
import { SuperHeroLoginDto } from './dto/super-hero-login.dto';
import { AuthGuard } from '../customOperators/auth.guard';
import { Roles } from '../customOperators/roles.decorator';

@Controller('hero')
export class SuperHeroFrontController {
  constructor(private superHeroService: SuperHeroService) {}

  @Get('confirmation')
  @Render('Shared/confirmationPage')
  confirmation() {
    return { title: 'Confirmation' };
  }
  @Get('join')
  @Render('SuperHero/joinPage')
  heroJoin(@Query('fv') formValues: string) {
    if (formValues) {
      const values = JSON.parse(
        Buffer.from(formValues, 'base64').toString('utf-8'),
      );
      return { title: 'Join', formValues: values };
    }
    return { title: 'Join' };
  }
  @Post('login')
  @UseFilters(RedirectExceptionFilter)
  async login(
    @Body() data: SuperHeroLoginDto,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    const result = await this.superHeroService.login(data);
    if (!result) {
      throw new BadRequestException(['Hero not found']);
    }
    if (!result.valid) return res.redirect('/hero/confirmation');
    req.session.access_token = result.access_token;
    res.cookie('access_token', result.access_token);
    return res.redirect('/hero/map');
  }
  @Get('map')
  @Roles('hero')
  @Render('SuperHero/mapPage')
  @UseGuards(AuthGuard)
  async map(@Req() req) {
    const user = req.user;
    const incidents = await this.superHeroService.getIncidents(user.id);
    console.log(incidents);
    return { title: 'Map', incidents };
  }
}

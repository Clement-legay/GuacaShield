import { SuperHeroService } from './super-hero.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
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
  async map(@Req() req, @Res() res) {
    const user = req.user;
    const types = await this.superHeroService.findHeroTypes(user.id);
    if (types.length === 0) return res.redirect('/hero/types');
    const mappedTypes = types.map((type) => ({
      id: type.IncidentType.id,
      name: type.IncidentType.name,
      imageUrl: type.IncidentType.imageUrl,
    }));
    const handledIncidents = await this.superHeroService.getHandledIncidents(
      user.id,
    );
    const matchingIncidents = await this.superHeroService.getMatchingIncidents(
      user.id,
      mappedTypes,
    );
    return { title: 'Map', handledIncidents, matchingIncidents, types };
  }

  @Get('types')
  @Roles('hero')
  @Render('SuperHero/typeChoicePage')
  @UseGuards(AuthGuard)
  async types() {
    const incidentTypes = await this.superHeroService.getIncidentTypes();
    return { title: 'Configure', incidentTypes };
  }
  @Post('types')
  @Roles('hero')
  @Redirect('/hero/map')
  @UseGuards(AuthGuard)
  async typesPost(@Body() data, @Req() req) {
    const user = req.user;
    await this.superHeroService.setHeroTypes(user.id, data.incidentTypes);
  }
}

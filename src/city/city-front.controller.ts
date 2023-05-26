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
import { AuthGuard } from '../customOperators/auth.guard';
import { CityService } from './city.service';
import { RedirectExceptionFilter } from '../customOperators/global-exception.filter';
import { CityLoginDto } from './dto/city-login.dto';
import { Roles } from '../customOperators/roles.decorator';
import { IncidentCreateDto } from "../incident/dto/incident-create.dto";

@Controller('town')
export class CityFrontController {
  constructor(private readonly cityService: CityService) {}

  @Get('join')
  @Render('city/joinPage')
  cityJoin(@Query('fv') formValues: string) {
    if (formValues) {
      const values = JSON.parse(
        Buffer.from(formValues, 'base64').toString('ascii'),
      );
      return { title: 'Join', formValues: values };
    }
    return { title: 'Join' };
  }
  @Get('confirmation')
  @Render('shared/confirmationPage')
  confirmation() {
    return { title: 'Confirmation' };
  }
  @Get('map')
  @Render('city/mapPage')
  @Roles('city')
  @UseGuards(AuthGuard)
  async cityMap(@Req() req) {
    const user = req.user;
    const incidents = await this.cityService.getIncidents(user.id);
    const incidentTypes = await this.cityService.getAllIncidentTypes();
    const heroes = await this.cityService.getNearHeroes(user.id);
    const contacts = await this.cityService.getContacts(user.id);
    return { title: 'Map', incidents, incidentTypes, contacts, heroes };
  }
  @Post('login')
  @UseFilters(RedirectExceptionFilter)
  async login(
    @Body() data: CityLoginDto,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    const result = await this.cityService.login(data);
    if (!result) {
      throw new BadRequestException(['City not found']);
    }
    if (!result.valid) return res.redirect('/town/confirmation');
    req.session.access_token = result.access_token;
    res.cookie('access_token', result.access_token);
    return res.redirect('/town/map');
  }
  @Post('declare-incident')
  @UseFilters(RedirectExceptionFilter)
  @Roles('city')
  @UseGuards(AuthGuard)
  async declareIncident(@Body() data: IncidentCreateDto, @Res() res) {
    await this.cityService.declareIncident(data);
    return res.redirect('/town/map');
  }
}

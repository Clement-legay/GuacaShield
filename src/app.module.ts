import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CityModule } from './city/city.module';
import { ContactModule } from './contact/contact.module';
import { IncidentTypeModule } from './incident-type/incident-type.module';
import { IncidentModule } from './incident/incident.module';
import { SuperHeroModule } from './super-hero/super-hero.module';

@Module({
  imports: [
    UsersModule,
    CityModule,
    ContactModule,
    IncidentTypeModule,
    IncidentModule,
    SuperHeroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CityModule } from './city/city.module';
import { ContactModule } from './contact/contact.module';
import { IncidentTypeModule } from './incident-type/incident-type.module';
import { IncidentModule } from './incident/incident.module';
import { SuperHeroModule } from './super-hero/super-hero.module';
import { Prisma } from './prisma/prisma';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './customOperators/constants';
import { AuthenticationMiddleware } from './customOperators/authentication.middleware';

@Module({
  imports: [
    UsersModule,
    CityModule,
    ContactModule,
    IncidentTypeModule,
    IncidentModule,
    SuperHeroModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Prisma],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}

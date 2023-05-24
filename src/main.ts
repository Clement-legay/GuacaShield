import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import * as session from 'express-session';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('GuacaShield API')
    .setDescription(
      'The GuacaShield API provides a way for heroes and city to use our services as they need.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Express template engine configuration
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  const hbsEngine = hbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views', 'Shared', 'Layouts'),
    partialsDir: join(__dirname, '..', 'views', 'Shared', 'Partials'),
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
      ifNotEquals: function (arg1, arg2, options) {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
      },
      ifEmpty: function (arg1, options) {
        return arg1.length > 0 ? options.inverse(this) : options.fn(this);
      },
      returnJSON: function (arg1) {
        return JSON.stringify(arg1);
      },
    },
  });
  app.engine('hbs', hbsEngine.engine);
  app.setViewEngine('hbs');
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

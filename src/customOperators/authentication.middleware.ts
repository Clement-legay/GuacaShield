import { Injectable, NestMiddleware, Next, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private prisma: PrismaClient) {}
  async use(@Req() req, @Res() res, @Next() next) {
    if (!req.session.access_token) {
      if (req.cookies.access_token) {
        req.session.access_token = req.cookies.access_token;
      }
    }
    const token = req.session.access_token;
    let user, checkUser;
    try {
      user = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    } catch {
      return next();
    }
    switch (user.type) {
      case 'city':
        checkUser = await this.prisma.city.findUnique({
          where: { name: user.name },
        });
        break;
      case 'hero':
        checkUser = await this.prisma.superHero.findUnique({
          where: { pseudo: user.pseudo },
        });
        break;
      case 'admin':
        checkUser = await this.prisma.user.findUnique({
          where: { email: user.email },
        });
        break;
    }
    if (!checkUser) return next();
    req.user = user;
    res.locals.user = user;
    next();
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginPortalDto } from './dto/login-portal.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaClient) {}

  async findOneByEmail(data: LoginPortalDto) {
    if (data.identifier.includes('@')) {
      const user = await this.prisma.user.findUnique({
        where: { email: data.identifier },
      });
      const superHero = await this.prisma.superHero.findUnique({
        where: { email: data.identifier },
      });
      return user
        ? { identifier: user.email, type: 'user' }
        : superHero && { identifier: superHero.email, type: 'superhero' };
    } else {
      const superhero = await this.prisma.superHero.findUnique({
        where: { pseudo: data.identifier },
      });
      const city = await this.prisma.city.findUnique({
        where: { name: data.identifier },
      });
      return superhero
        ? { identifier: superhero.pseudo, type: 'superhero' }
        : city && { identifier: city.name, type: 'city' };
    }
  }
  async logout(req, res) {
    req.session.destroy();
    res.clearCookie('access_token');
  }
}

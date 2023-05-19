import { Injectable, NestMiddleware, Next, Req, Res } from '@nestjs/common';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(@Req() req, @Res() res, @Next() next) {
    if (!req.session.access_token) {
      if (req.cookies.access_token) {
        req.session.access_token = req.cookies.access_token;
      }
    }

    next();
  }
}

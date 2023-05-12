import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getDatabaseUrl(): string {
    // from env
    const url = process.env.DATABASE_URL;
    if (url) {
      return url;
    }
    return 'not found';
  }
}

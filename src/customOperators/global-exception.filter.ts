import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class RedirectExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (exception instanceof HttpException) {
      if (exception.getStatus() === 404 || exception.getStatus() === 403) {
        return response.redirect('/notfound');
      } else if (exception.getStatus() === 400) {
        const redirectUrl = request.headers.referer || '/'; // Use Referer header as the redirect URL, fallback to root
        const url = new URL(redirectUrl);
        if (exception instanceof HttpException) {
          const redirectUrl = url.origin + url.pathname;
          const validationErrors = exception.getResponse()['message'];
          const validationString = Buffer.from(
            JSON.stringify(validationErrors),
            'utf-8',
          ).toString('base64');
          const formValues = Buffer.from(
            JSON.stringify(request.body),
            'utf-8',
          ).toString('base64');
          return response.redirect(
            redirectUrl + '?errors=' + validationString + '&fv=' + formValues,
          );
        } else {
          return response.redirect(redirectUrl);
        }
      }
    }
    console.log(exception);
    return response.redirect('/error');
  }
}

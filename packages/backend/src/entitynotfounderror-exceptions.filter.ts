
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { url } = request;
    const message = exception.message;

    const errorResponse = {
      path: url,
      timestamp: new Date().toISOString(),
      message: message,
    };

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
  }
}

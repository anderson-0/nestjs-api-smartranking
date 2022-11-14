import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter {
  
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';
    
    this.logger.error(`HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: message
      });
  }
}
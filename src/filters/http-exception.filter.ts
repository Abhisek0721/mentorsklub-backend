import { Errors } from 'src/constants';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { BadRequestError, Response as ApiResponse } from '@utils/utils.service';
import { ApiResponseT } from '@utils/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.message || Errors.SERVER_ERROR;

    if (status == HttpStatus.BAD_REQUEST) {
      const errors = exception['response']['message'];
      const code = 'STD-VLD-ERR';
      const data = [];
      const message = 'Invalid Request';
      const response_structure: ApiResponseT = new ApiResponse({
        data,
        message,
        errors,
        code,
      }).freeze();

      response.status(status).json(response_structure);
    } else {
      response.status(status).json({
        status,
        error,
      });
    }
  }
}

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.http_status_code;
    const message: string = exception.message || 'Invalid Request';
    const errors: any[] = exception.errors || [];
    const code: string = exception.code;
    const data: object = {};

    const response_structure: ApiResponseT = new ApiResponse({
      data,
      errors,
      message,
      code,
    }).freeze();

    response.status(status).json(response_structure);
  }
}

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.FORBIDDEN;
    const errors = exception['response']['message'];
    const code = 'FORBIDDEN-ERR';
    const data = [];
    const message = 'You do not have permission to access this resource';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      errors,
      code,
    }).freeze();

    response.status(status).json(response_structure);
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.UNAUTHORIZED;
    const errors = exception['response']['message'];
    const code = 'UNAUTHORIZED-ERR';
    const data = [];
    const message = 'You are not authorized to access';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      errors,
      code,
    }).freeze();

    response.status(status).json(response_structure);
  }
}

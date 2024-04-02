import { Errors } from 'src/constants';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
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
      
      const errors = exception['response']['message']
      const code = "STD-VLD-ERR"
      const data = []
      const message = 'Invalid Request'
      const response_structure: ApiResponseT = new ApiResponse({
        data
      , message
      , errors
      , code
      }).freeze()
        
      response.status(status).json(response_structure);
          
    }
    else {
      response.status(status).json({
        status,
        error,
      });
    }
    
  }
}

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {

  constructor () {}

  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.http_status_code;
    const message: string = exception.message || 'Invalid Request';
    const errors: any[] = exception.errors || []
    const code: string = exception.code
    const data: object = {}

    const response_structure: ApiResponseT = new ApiResponse({
          data
        , errors
        , message
        , code
      }).freeze()
      
    response.status(status).json(response_structure);
  }
}


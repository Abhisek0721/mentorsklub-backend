import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ApiResponse as ApiResponseInterface,
  PaginatedApiResponse as PaginatedApiResponseInterface,
} from './interfaces';
import { ApiResponseT, PaginatedApiResponse, PageT } from './types';
import { Types, UpdateWriteOpResult } from 'mongoose';

export class BadRequestError extends Error {
  message: string;
  errors: any[];
  code: string;
  data: object;
  http_status_code: number = HttpStatus.BAD_REQUEST;

  constructor(
    message: string = 'Invalid Request',
    code: string = 'INVALID_REQUEST',
    errors: any[] = [],
  ) {
    super();
    this.message = message;
    this.errors = errors;
    this.code = code;
  }
}

export class Response implements ApiResponseInterface {
  /**
   * Standard Response Builder Implementation
   * @param partial
   *
   * @@Warning : must use .freeze() on instances of this class before use.
   */

  static BadRequest = BadRequestError;

  constructor(partial: Partial<Response>) {
    Object.assign(this, partial);
    Object.keys(this).forEach((prop) => {
      let v = `${prop}_validator`;
      if (v in this) {
        this[v]();
      }
    });
  }

  readonly message: string;
  readonly data: object;
  readonly code: string | null;
  errors: any | null;

  message_validator() {
    let isAlphaNumeric_regexp = new RegExp(`^[a-zA-Z0-9",'! ]*$`);
    let isAlphaNumeric: boolean = isAlphaNumeric_regexp.test(this.message);
    if (!this.message || !isAlphaNumeric) {
      throw new Response.BadRequest(`${this.message} must be AlphaNumeric`);
    }
  }

  freeze() {
    return Object.freeze(this);
  }
}

class PaginatedResponse implements PaginatedApiResponseInterface {
  /**
   * Standard Paginated Response Builder Implementation
   * @param partial
   *
   * @@Warning : must use .freeze() on instances of this class before use.
   */

  static BadRequest = BadRequestError;

  constructor(partial: Partial<PaginatedResponse>) {
    Object.assign(this, partial);
    Object.keys(this).forEach((prop) => {
      let v = `${prop}_validator`;
      if (v in this) {
        this[v]();
      }
    });
  }

  readonly message: string;
  readonly data: object;
  readonly code: string | null;
  errors: any | null;
  readonly page: PageT;

  message_validator() {
    let isAlphaNumeric_regexp = new RegExp(`^[a-zA-Z0-9",'! ]*$`);
    let isAlphaNumeric: boolean = isAlphaNumeric_regexp.test(this.message);
    if (!this.message || !isAlphaNumeric) {
      throw new PaginatedResponse.BadRequest(
        `${this.message} must be AlphaNumeric`,
      );
    }
  }

  freeze() {
    return Object.freeze(this);
  }
}

@Injectable()
export class ApiUtilsService {
  constructor() {}

  getDataUpdateMessage(subscribeUpdate: UpdateWriteOpResult): string {
    let message: string;
    if (subscribeUpdate.modifiedCount > 0) {
      message = 'Updated Successfully';
    } else if (subscribeUpdate.upsertedId) {
      message = 'Inserted Successfully';
    } else {
      message = 'Data is same as in request payload';
    }
    return message;
  }

  make_response(
    data: object,
    message: string = 'Successful',
    code: string | null = null,
    errors: string | null = null,
  ): ApiResponseT {
    /**
     * Response Builder utility
     */
    return new Response({
      data,
      message,
      code,
      errors,
    }).freeze();
  }

  make_paginated_response(options: {
    data: object;
    message?: string;
    code?: string | null;
    errors?: string | null;
    page: PageT;
  }): PaginatedApiResponse {
    /**
     * Paginated Response Builder utility
     */
    const {
      data,
      message = 'Successful',
      code = null,
      errors = null,
      page,
    } = options;
    return new PaginatedResponse({
      data,
      message,
      code,
      errors,
      page,
    }).freeze();
  }
}

export class ApiQueryUtils {
  constructor() {}

  public static validateFromAndToQuery(from?: string, to?: string) {
    if (from && to) {
      if (new Date(from) > new Date(to)) {
        throw new BadRequestError(
          `Invalid query! 'from' can't be greater than 'to'`,
          'DB404',
        );
      }
    }
  }
}

export class ApiPageUtils {
  constructor() {}

  public static getPageData(options: {
    totalData: number;
    currentPage: number;
    totalPages: number;
  }): PageT {
    const totalData = Number(options.totalData);
    const currentPage = Number(options.currentPage);
    const totalPages = Number(options.totalPages);
    let next: number | null = Number(currentPage) + 1;
    let previous: number | null = Number(currentPage) - 1;

    if (currentPage === totalPages) {
      next = null;
    }
    if (currentPage === 1) {
      previous = null;
    }

    const output: PageT = {
      current: currentPage,
      next: next,
      previous: previous,
      total: totalPages,
      size: totalData,
      records: {
        total: totalPages,
        onPage: currentPage,
      },
    };
    return output;
  }
}

export class ValidateDataUtils {
  public static validateObjectIdString(
    objectIdString: string,
    fieldName: string = 'ObjectId',
  ) {
    try {
      new Types.ObjectId(objectIdString);
    } catch (error) {
      throw new BadRequestException(`Invalid ${fieldName}`);
    }
  }
}

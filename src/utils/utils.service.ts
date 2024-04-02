import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ApiResponse as ApiResponseInterface,
  PaginatedApiResponse as PaginatedApiResponseInterface,
} from './interfaces';
import { ApiResponseT, PaginatedApiResponse, Page as PageT } from './types';

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

  make_paginated_response(
    data: object,
    message: string = 'Successful',
    code: string | null = null,
    errors: string | null = null,
    page: PageT,
  ): PaginatedApiResponse {
    /**
     * Paginated Response Builder utility
     */
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

  public static getPageData(
    currentPage: number,
    totalPage: number,
    totalData: number,
  ): PageT {
    let next: number | null = currentPage + 1;
    let previous: number | null = currentPage - 1;

    if (currentPage === totalPage) {
      next = null;
    }
    if (currentPage === 1) {
      previous = null;
    }

    const output: PageT = {
      current: currentPage,
      next: next,
      previous: previous,
      total: totalPage,
      size: totalData,
      records: {
        total: totalPage,
        onPage: currentPage,
      },
    };
    return output;
  }
}

import { types } from "util";

export const Errors = {
  MALFORMED_REQUEST: 'MALFORMED_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
};

export const RedisConstants = {
  LOGOUT_GROUP: 'LOGOUT_GROUP',
};

export enum ROLES {
  MENTOR = 'mentor',
  MENTEE = 'mentee'
}

export enum STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export const DATABASE_NAME = process.env.DATABASE_NAME || "mentorsklub";
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

export enum MentorshipField {
  Programming = "Programming",
  Finance = "Finance",
  Business = "Business",
  Marketing = "Marketing",
  Design = "Design",
  Engineering = "Engineering",
  Health = "Health",
  Education = "Education",
  Science = "Science",
  Technology = "Technology",
  Arts = "Arts",
  Language = "Language",
  Music = "Music",
  Sports = "Sports",
  Other = "Other"
}
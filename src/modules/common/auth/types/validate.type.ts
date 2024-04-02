import { ROLES } from "@constants/index";
import { Types } from "mongoose";

export type ValidateType = {
  userId: string|Types.ObjectId;
  email: string;
  role: ROLES;
};

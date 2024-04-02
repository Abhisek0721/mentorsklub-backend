import { ROLES } from "@constants/index";

export type JwtPayload = {
    userId: string;
    email: string;
    role: ROLES;
}
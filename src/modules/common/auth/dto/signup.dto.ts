import { IsString, IsEnum } from "class-validator";
import { ROLES } from "@constants/index";

export class SignupDTO {
    @IsString()
    fullName: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsEnum(ROLES)
    role: ROLES;
}



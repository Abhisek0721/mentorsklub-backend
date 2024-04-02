import { IsOptional, IsString } from "class-validator";

export class EditUserDTO {
    @IsOptional()
    @IsString()
    fullName: string;

    @IsOptional()
    @IsString()
    phoneNumber: string;
}



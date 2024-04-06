import { IsString } from "class-validator";

export class UploadProfileImageDTO {
    @IsString()
    profileImageUri: string;
}



import { IsString } from "class-validator";

export class EditMessageDTO {
    @IsString()
    messageId: string;

    @IsString()
    content: string;
}



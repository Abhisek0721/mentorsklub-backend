import { IsBoolean, IsOptional, IsString } from "class-validator";

export class SendMessageDTO {
    @IsString()
    receiverUserId: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    replyTo: string;
}



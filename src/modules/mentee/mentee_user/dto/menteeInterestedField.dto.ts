import { MentorshipField } from "@constants/index";
import { IsArray } from "class-validator";

export class MenteeInterestedFieldDTO {
    @IsArray()
    interestedFields: MentorshipField[];
}
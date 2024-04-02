import { SignupDTO } from "../dto/signup.dto"

export type SignupResponseType = {
    userData: {
        _id: string;
        fullName: string;
        email: string;
        role: string;
        isVerified: boolean;
    };
    accessToken: string;
}
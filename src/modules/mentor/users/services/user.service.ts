import {Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  async getUser() {
    const user = {
        "firstName": "Abhisekh",
        "lastName": "Upadhaya",
        "email": "abhisek0721@gmail.com",
        "userType": "mentee"
    };
    return user;
  }

}

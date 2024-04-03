import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";


@Controller()
export class AppController {
    @Get()
    index(@Req() req: Request, @Res() res: Response) {
        return res.send(`<h1> Running on Port: ${process.env.PORT} </h1>`);
    }
}
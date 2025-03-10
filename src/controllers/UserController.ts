import { JsonController, Post, Req, Res } from "routing-controllers";
import { Service } from "typedi";
require("dotenv").config();
import { HttpStatusCode } from "axios";

@Service()
@JsonController("/user")
export class UserController {
    constructor(
    ) {
    }

    @Post("/customer-login")
    async loginHandler(@Res() res: any, @Req() req: any): Promise<any> {
        try {
            return res.status(200).json({ status: true, message: "ok" });
        } catch (errors) {
            return res.status(HttpStatusCode.BadRequest).json({ status: false, message: "Failed", details: { error: (errors as Error).message } });
        }
    }

}
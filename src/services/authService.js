import database from "../database/index.js";
import Mailer from "../utils/mailer.js";
import { generateCode } from "../utils/two_factor_code.js";
import UserService from "./userService.js";

class AuthService{
  static async sendCode(id){
    const users = await UserService.getAllUser();
    const created_codes = [];

    for(const u of users){
      created_codes.push(u.CODE);
    }

    let code = undefined;
    do{
      code = generateCode();
    } while (created_codes.includes(code));

    const user = await UserService.getUser(id);
    const user_email = user.EMAIL;

    const mailer = new Mailer();
    const isSended = await mailer.sendCodeMail(code, user_email);

    if(!isSended.status){
      throw new Error(isSended.message);
    }

    await database("User").update({IDENTIDY_CODE: code}).where({ID: id});

    return user_email;

  }
}

export default AuthService;
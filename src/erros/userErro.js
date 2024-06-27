import { HttpCode, HttpErro } from "./erro.config.js";

export class UserNotFound extends HttpErro{
  constructor(message = "Nenhum usuário encontrado"){
    super(HttpCode.NOT_FOUND, message);
  }
}

export class EmailAlredyRegistered extends HttpErro{
  constructor(message = "Email já registrado"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}


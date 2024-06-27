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

export class EmailNotRegistered extends HttpErro{
  constructor(message = "Email não registrado"){
    super(HttpCode.NOT_FOUND, message);
  }
}

export class IncorretPassword extends HttpErro{
  constructor(message = "Senha Incorreta"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}

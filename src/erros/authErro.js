import { HttpCode, HttpErro } from "./erro.config.js";

export class TokenNotInformed extends HttpErro{
  constructor(message = "Token não fornecido"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class BadFormatToken extends HttpErro{
  constructor(message = "Token mal formatado"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class InvalidToken extends HttpErro{
  constructor(message = "Token inválido"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}
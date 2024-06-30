import { HttpCode, HttpErro } from "./erro.config.js";

export class InvalidCode extends HttpErro{
  constructor(message = "Código inválido"){
    super(HttpCode.BAD_REQUEST, message);
  }
}
export class IncompatibleCode extends HttpErro{
  constructor(message = "Código incorreto"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}
export class ExpiredCode extends HttpErro{
  constructor(message = "Código expirado"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}
import { HttpCode, HttpErro } from "./erro.config.js";

//Uso comum entre autenticações e autorizações

export class TokenNotInformed extends HttpErro{
  constructor(message = "Token necessário não informado. Verifique a documentação do sistema."){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class BadFormatToken extends HttpErro{
  constructor(message = "Token necessário mal formatado"){
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class InvalidToken extends HttpErro{
  constructor(message = "Token necessário inválido"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}

//Exclusivo da autenticação em 2 fatores
export class PermissionDenied extends HttpErro{
  constructor(message = "Permissão não concedida completa ou corretamente"){
    super(HttpCode.UNAUTHORIZED, message);
  }
}
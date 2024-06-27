
//Enumeração dos status code
export const HttpCode = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  UNPROCESSABLE_CONTENT: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export class HttpErro extends Error{
  constructor(code, message){
    super(message);
    
    if(Object.values(HttpCode).includes(code)){
      this.code = code;
    } else{
      throw new HttpErro(500, "Erro interno de classificação");
    }
    
  }

  sendMessage(express_response){
    express_response.status(this.code).json({code: this.code, message: this.message});
  }

  toJson(){
    return {code: this.code, message: this.message};
  }
}

export class ImprevistError extends HttpErro{
  constructor(message){
    super(HttpCode.INTERNAL_SERVER_ERROR, "Um erro inesperado aconteceu. --- "+ message);
  }
}

export class JoiValidatorError extends HttpErro{
  constructor(message = "Erro ao validar entradas"){
    super(HttpCode.BAD_REQUEST, message);
  }
}
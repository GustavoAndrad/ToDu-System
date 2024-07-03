
/**
 * @description Recebe um email e retorna ele formatado, substituindo todas as letras do por "*", 
 * com exceção da primeira e do domínio
 * @param {string} email
 * @returns {string} - e******@gmail.com
 */
export default function hideEmail(email){
  const [username, domain] = email.split("@");

  const formatted_username = username.substring(0, 1) + "*".repeat(username.length - 1);

  const formated_email = formatted_username + "@" + domain;

  return formated_email;
}


/**
 * @deprecated
 *  PRIMEIRA VERSÃO DO ALGORITIMO (SUBSTIDUIDA PARA QUE POSSAM SER USADOS MÉTODOS AUXILIARES NATIVOS DO JS)
 * 
  let format_email = (user.EMAIL).split("");
    for(let i=1;i<=format_email.length;i++){
      if(format_email[i]==="@"){
        break;
      }
      format_email[i] = "*";
    }

    format_email = format_email.join("");

    user.EMAIL = format_email;

 */
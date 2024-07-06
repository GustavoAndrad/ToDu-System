import nodemailer from "nodemailer";
import "dotenv/config";

/**
 * @description Classe responsável pelo envio de e-mails
 */
class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * @description Envia um e-mail contendo um código de verificação para o usuário especificado.
   * Retorna um objeto {status: boolean, message: string}.
   * Caso dê certo: {status: true, message: "ok"}, caso não: {status: false, message: <ERROR_MESSAGE>}
   * 
   * @param {string} code - O código de verificação a ser enviado.
   * @param {string} user_email - O e-mail do usuário que receberá o código de verificação.
   * @returns {Promise<{status: boolean, message: string}>} - Um objeto contendo o status booleno e uma string ['ok' ou <mensagem de erro>].
   * @async 
   */
  async sendCodeMail(code, user_email) {
    const mailOptions = {
      from: `"ToDu Team 💙💛" <${process.env.EMAIL_USER}>`,
      to: user_email,
      subject: "Verify Your Identidy",
      html: `
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width">
                <title>Two Factor Verification</title>
            <style>
                *{
                    font-family: 'Verdana', 'sans-serif';
                }

                body{
                    height: 100%;
                    width: 100%;
                }

                header{
                    background-color: #FFEA05;
                    width: 100%;
                    color: #3E3E96;
                    padding-top: 1%;
                    padding-bottom: 1%;
                    border-radius: 100px;
                }
                
                h1{
                  width: 100%;
                  text-align: center;
                }

                main{
                    width: 100%;
                }

                footer{
                    color: darkred;
                    width: 100%;
                }

                p{
                    font-weight: bold;
                    width: 100%;
                    text-align: center;
                }

                #code{
                    color: #3E3E96; 
                    font-size: 20px;
                }

                #time{
                    color: darkred; 
                }
                
            </style>
            </head>

            <body>
                <header>
                    <h1>Verify Your Identity</h1>
                </header>
                <main>
                    <p>Your code is:</p>
                    <p id="code">${code}</p>
                    <p>This code just is valid for the next <span id="time">10 minutes!</span></p>
                    <p>Please use it to authenticate your identity.</p>
                    <p>If you're having problems to verify your credentials in the website, please contact us.</p>
                </main>
                <footer>
                    <p>If you did not request this, please ignore this email</p>
                </footer>
            </body>

            </html>
        `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return {status: true, message: "ok"};

    } catch (error) {
      return {status: false, message: error.message};
    }
  }
}

export default Mailer;

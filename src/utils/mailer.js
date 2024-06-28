import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
                    color: #3E3E96;
                    width: 100%;
                    padding-top: 1%;
                    padding-bottom: 1%;
                    text-align: center;
                    border-radius: 100px;
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
                
            </style>
            </head>

            <body>
                <header>
                    <h1>Verify Your Identity</h1>
                </header>
                <main>
                    <p>Your code is:</p>
                    <p id="code">${code}</p>
                    <p>Please use this code to verify your identity.</p>
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

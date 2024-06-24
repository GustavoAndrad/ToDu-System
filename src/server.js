//Importações
require('dotenv').config();
const express = require('express');
const routes = require('./routes/index');

//Configurações do servidor
const app = express();
routes(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
const ENVIROMENT = process.env.NODE_ENV;

app.listen(PORT, HOST, ()=>{
	console.log(`Server listening on: http://${HOST}:${PORT}`);
	console.log(`Enviroment: ${ENVIROMENT}`);
});
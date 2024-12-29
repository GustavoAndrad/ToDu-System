import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import fetch from "node-fetch"; // Usado para garantir funcionamento do fetch independente da versão do node
import { APITimezoneDBError, FileSystemException } from "../erros/erro.config.js";

// "Monta" __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de cache
const CACHE_FILE = path.join(__dirname, "../../cache/timezones.json");
const CACHE_EXPIRATION_HOURS = 72;

/**
 * @description Busca todas ass timezones existentes
 * @async
 * @returns {Promisse<Array<string>>} ["America/São Paulo","Pacific/Wake",...,"Australia/Melbourne"]
 */
export default async function fetchTimezones() {
  if (shouldUpdateCache()) {
    console.log("🔎   Cache expired or not found. Fetching new data...");

    const data = 
        await fetch(
          `https://api.timezonedb.com/v2.1/list-time-zone?key=${process.env.TIMEZONEDB_PRIVATE_API}&format=json`)
          .then(response => response.json())
          .catch(e => {
            throw new APITimezoneDBError(
              "TimezoneDB just handles 1 request per second. Refresh or try default (null) timezone --- " + e.message
            );
          });

    if (data.status === "FAILED" || !data.zones || data.zones.length === 0) {
      throw new APITimezoneDBError(data.message || "Failed to fetch timezones.");
    }

    const timezones = data.zones.map(zone => zone.zoneName);

    saveCache({ timezones, timestamp: Date.now() });


    return timezones;
  
  } else {
    console.log("💡   Using cached data...");
    const cachedData = loadCache();
    return cachedData.timezones;
  }
}

/**
 * @description Verifica o estado das timezones em cache
 * @returns {boolean}
 */
function shouldUpdateCache() {
  try{
    if (!fs.existsSync(CACHE_FILE)) return true;

    const cachedData = loadCache();
    const lastFetched = cachedData.timestamp || 0;
    const hoursSinceLastFetch = (Date.now() - lastFetched) / (1000 * 60 * 60);

    return hoursSinceLastFetch > CACHE_EXPIRATION_HOURS;
  } catch(e){
    throw new FileSystemException(e.message);
  }
}

/**
 * @description Carrega as informações armazenadas no arquivo de cache, contendo timezones e o timestamp. 
 * Caso o arquivo não exista ou esteja vazio, retorna um objeto vazio.
 * 
 * @returns {{timezones?: string[], timestamp?: number}} 
 * Um objeto contendo:
 * - `timezones`: Um array de strings com os nomes dos fusos horários.
 * - `timestamp`: Um número representando o timestamp armazenado.
 * 
 * Retorna um objeto vazio `{}` se o arquivo não existir ou estiver vazio.
 * 
 */
function loadCache() {
  try{
    console.log("📖   Reading cache...");

    if (!fs.existsSync(CACHE_FILE)) return {};

    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  
  } catch(e){
    throw new FileSystemException(e.message);
  }
}

/**
 * @description  Salva timezones no arquivo temporário de cache pré-especificado
 * 
 * @param {*} data 
 * Um objeto contendo:
 * - `timezones`: Um array de strings com os nomes dos fusos horários.
 * - `timestamp`: Um número representando o timestamp armazenado. 
 */
function saveCache(data) {
  try{
    console.log("👜   Writing cache...");

    const directory = path.dirname(CACHE_FILE);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  
  } catch(e){
    throw new FileSystemException(e.message);
  }
}
import "dotenv/config";
import { HttpErro, ImprevistError, ProcessTimezoneError } from "../erros/erro.config.js";
import fetchTimezones from "../utils/timezone_caching.js";

export default async function handle_timezone_change(req, res, next) {
  try {
    const timezone = req.headers.timezone;

    if (timezone) {
      const possible_timezones = await fetchTimezones().catch(e => { throw e; });

      if (!possible_timezones.includes(timezone)) {
        throw new ProcessTimezoneError(`${timezone} é uma timezone inválida`);
      }

      req.timezone = timezone;
    } else {
      req.timezone = process.env.DEFAULT_TIMEZONE;
    }

    next();

  } catch (e) {
    console.error(e);

    if (e instanceof HttpErro) {
      e.sendMessage(res);
    } else {
      const erro_imprevisto = new ImprevistError(e.message);
      erro_imprevisto.sendMessage(res);
    }
  }
}

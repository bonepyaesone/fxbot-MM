import request from "request";
import cheerio from "cheerio";
import axios from "axios";
import {get } from "lodash";
import officerParallel from "./parallel";
import officerCbn from "./cbn";
import officerWesty from "./western";
import officerMoneyGram from "./moneygram";

let API_BASE = process.env.JSON_RATES_STORE;
let url = "http://abokifx.com";

function scrape() {
  const j = request.jar();
  const cookie = request.cookie(`PHPSESSID=${process.env.SESS}`);
  j.setCookie(cookie, url);
  request({ url: url, jar: j }, function(error, response, html) {
    if (!error) {
      let $ = cheerio.load(html);
    
      //western union rates is currently unstable and sometimes breaks.
      const parallelRates = officerParallel(html);
      const cbnRates = officerCbn(html);
      const westernRates = officerWesty(html);
      const moneyGramRates = officerMoneyGram(html);

      if (!parallelRates || parallelRates === undefined) {
        scrape();
        return;
      }
      const nse = {
        parallel: {
          usd: parallelRates.usd,
          gbp: parallelRates.gbp,
          eur: parallelRates.eur
        },
        wu: {
          usd: westernRates[9],
          gbp: westernRates[10],
          eur: westernRates[11]
        },
        moneygram: {
          usd: moneyGramRates[9],
          gbp: moneyGramRates[10],
          eur: moneyGramRates[11]
        },
        cbn: {
          usd: $(get(cbnRates, "[1]")).text(),
          gbp: $(get(cbnRates, "[2]")).text(),
          eur: $(get(cbnRates, "[3]")).text()
        }
      }
      console.log(nse);
      try {
        if (nse) {
          request.put({ url: API_BASE, body: nse, json: true }, function(error, response, body) {
            if (error) {
              return console.error("upload failed:", error);
            }
            console.log("Upload successful!  Server responded with:", body);
          });
        }
      } catch (e) {
        console.log("error occured sending json", e);
      }
    }
  });
}

async function getRates() {
  try {
    const refreshScrape = await scrape();
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.log(error, "error retreiving data");
  }
}

export default { scrape, getRates }

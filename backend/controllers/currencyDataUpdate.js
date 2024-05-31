const Currency = require("../models/currency");
const CurrencyDataSet = require("../models/currencyDataSet");
const CurrencyDataSetH4 = require("../models/currencyDataSet4");
const slugify = require("slugify");
const { getDataByOanda } = require("../oanda");
const { getHistoricalData } = require("../yahooFinance");

exports.createH4 = async (req, res) => {
  try {
    const pair = req.body.name;
    const fromData = req.body.fromData;
    const toData = req.body.toData;
    const granularity = req.body.granularity;

    const currencyPair = await Currency.findOne({
      name: pair,
    });


    if (!currencyPair) {
      return res.status(400).json({ msg: `Non esiste la valuta ${pair}` });
    }

    const responseOanda = await getDataByOanda({
      endpoint: "instruments",
      pair: pair,
      fromData: fromData,
      toData: toData,
      granularity: granularity,
      price: "A",
    });

    const createRange = (fromDate, toDate) => {
      // Ottieni la data odierna
      const dataOdierna = new Date();
      // Converti la data fornita nel formato "2023-10-20" in un oggetto Date
      const dataFornita = new Date(toDate);
      if (dataFornita < dataOdierna) {
        const fromDateSplit = fromDate.split("-");
        const toDateSplit = toDate.split("-");
        let fromDateTimestamp = new Date(
          fromDateSplit[0],
          fromDateSplit[1] - 1,
          fromDateSplit[2].substring(0, 2),
          "00",
          "00",
          "00",
          "00"
        );
        let toDateTimestamp = new Date(
          toDateSplit[0],
          toDateSplit[1] - 1,
          toDateSplit[2].substring(0, 2),
          "23",
          "59",
          "59",
          "00"
        );
        let ustart = fromDateTimestamp.getTime();
        let uend = toDateTimestamp.getTime();
        let newDataCandles = [];
        const dateDaCercare = [];
        for (unix = ustart; unix <= uend; unix += 86400000) {
          let thisDay = new Date(unix);
          let d = thisDay.toISOString();

          let dataEsiste = responseOanda.some((o) => {
            let oDate = new Date(o.time); // Converti o.time in un oggetto Date
            return oDate.toISOString().substring(0, 19) === d.substring(0, 19); // Confronta fino ai secondi
          });

          let oggettoPiuVicino = null;
          let differenzaMinima = Infinity;

          if (!dataEsiste) {
            responseOanda.forEach((oggetto) => {
              const oggettoDate = new Date(oggetto.time);
              const targetDateFormatZulu = new Date(
                targetDate + "T00:00:00.000Z"
              );
              const differenza = Math.abs(targetDateFormatZulu - oggettoDate);

              if (differenza < differenzaMinima) {
                oggettoPiuVicino = { ...oggetto };
                oggettoPiuVicino.time = targetDateFormatZulu.toISOString(); // Imposta la proprietà "time"
                differenzaMinima = differenza;
              }
            });
            if (oggettoPiuVicino) {
              dateDaCercare.push(oggettoPiuVicino);
            }
          }
          let dataCandles = responseOanda.filter((o) => {
            let oDate = new Date(o.time);
            let dDate = new Date(d);
            return (
              oDate.toISOString().substring(0, 19) ===
              dDate.toISOString().substring(0, 19)
            ); // Confronto fino ai secondi
          });
          if (dataCandles.length > 0) {
            newDataCandles.push(dataCandles[0]);
          }
        }

        const arrayCombinato = newDataCandles.concat(dateDaCercare);

        // Ordina l'array combinato in base alla data "time"
        arrayCombinato.sort((a, b) => {
          const timeA = new Date(a.time);
          const timeB = new Date(b.time);

          return timeA - timeB;
        });

        // Ora l'array combinato è ordinato per data ascendente

        return arrayCombinato;
      }
      return [];
    };

    const periodCandles = createRange(fromData, toData);
    console.log(periodCandles);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create product failed" + err);
  }
};

exports.create = async (req, res) => {
  function transformCurrencyPair(input) {
    // Rimuovi eventuali caratteri non desiderati come spazi o trattini bassi
    const cleanedInput = input.replace(/[^A-Z]/g, "");

    // Aggiungi "=X" alla fine della stringa
    const transformedString = cleanedInput + "=X";

    return transformedString;
  }

  try {
    //   EUR_USD/candles?price=A&from=2022-06-01&to=2022-06-30&granularity=D

    const pair = req.body.name;
    const fromData = req.body.fromData;
    const toData = req.body.toData;
    const granularity = req.body.granularity;

    const currencyPair = await Currency.findOne({
      name: pair,
    });

    if (!currencyPair) {
      return res.status(400).json({ msg: `Non esiste la valuta ${pair}` });
    }

    const symbol = transformCurrencyPair(pair);
    //"EURUSD=X";
    const queryOptions = {
      period1: fromData,
      period2: toData,
      interval: "1d",
      events: "history",
    };

    // Funzione per trasformare i dati
    function transformData(originalData) {
      return originalData.map((item) => ({
        complete: true,
        volume: item.volume,
        time: item.date.toISOString(),
        ask: {
          o: item.open.toFixed(5), // Arrotonda a 5 decimali
          h: item.high.toFixed(5),
          l: item.low.toFixed(5),
          c: item.close.toFixed(5),
        },
      }));
    }

    const responseYahoo = await getHistoricalData(symbol, queryOptions)
      .then((results) => {
        const trasformYahooResponse = transformData(results);
        return trasformYahooResponse;
      })
      .catch((error) => {
        console.error("Errore nella richiesta:", error);
      });

    //   const c = JSON.parse(response);

    const createRange = (fromDate, toDate) => {
      // Ottieni la data odierna
      const dataOdierna = new Date();
      // Converti la data fornita nel formato "2023-10-20" in un oggetto Date
      const dataFornita = new Date(toDate);
      if (dataFornita < dataOdierna) {
        const fromDateSplit = fromDate.split("-");
        const toDateSplit = toDate.split("-");

        let fromDateTimestamp = new Date(
          fromDateSplit[0],
          fromDateSplit[1] - 1,
          fromDateSplit[2].substring(0, 2),
          "00",
          "00",
          "00",
          "00"
        );
        let toDateTimestamp = new Date(
          toDateSplit[0],
          toDateSplit[1] - 1,
          toDateSplit[2].substring(0, 2),
          "00",
          "00",
          "00",
          "00"
        );

        let ustart = fromDateTimestamp.getTime();
        let uend = toDateTimestamp.getTime();
        let newDataCandles = [];
        const dateDaCercare = [];
        for (unix = ustart; unix <= uend; unix += 86400000) {
          let thisDay = new Date(unix);
          let d = thisDay.toISOString();
          let targetDate = d.toString().substring(0, 10);

          //    console.log(d, thisDay.getDay());
          let dataEsiste = responseYahoo.some(
            (o) => o.time.substring(0, 10) === d.substring(0, 10)
          );

          let oggettoPiuVicino = null;
          let differenzaMinima = Infinity;

          if (!dataEsiste) {
            responseYahoo.forEach((oggetto) => {
              const oggettoDate = new Date(oggetto.time);
              const targetDateFormatZulu = new Date(
                targetDate + "T00:00:00.000Z"
              );
              const differenza = Math.abs(targetDateFormatZulu - oggettoDate);

              if (oggettoDate < targetDateFormatZulu) {
                const nuovoOggettoPiuVicino = {
                  ...oggettoPiuVicino,
                  ...oggetto,
                };
                // Imposta la proprietà "time" su "targetDateFormatZulu" utilizzando toISOString()
                nuovoOggettoPiuVicino.time = targetDateFormatZulu.toISOString();
                oggettoPiuVicino = nuovoOggettoPiuVicino;
                differenzaMinima = differenza;
              }
            });

            // Controlla se è stato trovato un oggetto più vicino prima di aggiungerlo all'array dateDaCercare
            if (oggettoPiuVicino) {
              dateDaCercare.push(oggettoPiuVicino);
            }
          }

          let dataCandles = responseYahoo.filter(
            (o) => o.time.substring(0, 10) === d.substring(0, 10)
          );

          if (dataCandles.length > 0) {
            newDataCandles.push(dataCandles[0]);
          }
        }

        //  console.log(newDataCandles, dateDaCercare);

        // Unisci le due array
        const arrayCombinato = newDataCandles.concat(dateDaCercare);

        // Ordina l'array combinato in base alla data "time"
        arrayCombinato.sort((a, b) => {
          const timeA = new Date(a.time);
          const timeB = new Date(b.time);

          return timeA - timeB;
        });

        // Ora l'array combinato è ordinato per data ascendente

        return arrayCombinato;
      }
      return [];
    };

    const periodCandles = createRange(fromData, toData);

    const newObjData = {
      granularity: granularity,
      candles: periodCandles,
    };

    const filter = { _id: currencyPair._id };

    const eleCur = await CurrencyDataSet.findOne(filter);
    let msg;

    if (!eleCur) {
      const updateCandles = await CurrencyDataSet.findOneAndUpdate(
        filter,
        // newObjData,
        {
          $addToSet: {
            candles: { $each: newObjData.candles },
          },
        },
        {
          new: true,
          upsert: true,
        }
      ).exec();

      res.status(200).send(JSON.stringify(eleCur));
    } else {
      if (periodCandles.length > 0) {
        const bulkOps = periodCandles.map((e) => ({
          updateOne: {
            filter: { _id: currencyPair._id, "candles.time": { $ne: e.time } },
            update: { $push: { candles: e } },
          },
        }));

        CurrencyDataSet.bulkWrite(bulkOps)
          .then((result) => {
            res.send(periodCandles);
          })
          .catch((err) => {
            console.error("Errore durante l'aggiornamento:", err);
            res.status(500).send(err);
          });
      }

      // res.send(periodCandles);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Create product failed" + err);
  }
};

exports.list = async (req, res) =>
  res.json(await Currency.find({}).sort({ createdAt: -1 }).exec());

exports.all = async (req, res) =>
  res.json(
    await Currency.find({ id: "62fcf92818e12464410e7b18" })
      .populate(CurrencyDataSet)
      .exec()
  );

//  trova il candles.time più recente
/*
exports.getMostRecentDate = async (req, res) => {
  try {
    const result = await CurrencyDataSet.aggregate([
      { $unwind: "$candles" },
      {
        $lookup: {
          from: "currencies", // nome della collezione da cui unire
          localField: "_id", // campo nella collezione corrente (CurrencyDataSet)
          foreignField: "_id", // campo nella collezione da cui unire (currencies)
          as: "currencyInfo", // nome dell'array in cui verranno inseriti i risultati uniti
        },
      },
      { $unwind: "$currencyInfo" }, // Poiché $lookup restituisce un array, $unwind lo "apre" per ottenere un oggetto
      { $sort: { "candles.time": -1 } },
      { $limit: 1 },
      {
        $project: {
          // Seleziona solo i campi che ti interessano
          "candles.time": 1,
          currencyName: "$currencyInfo.name",
        },
      },
    ]).exec();

    if (result.length > 0) {
      res.status(200).json({
        mostRecentDate: result[0].candles.time,
        curName: result[0].currencyName,
      });
    } else {
      res
        .status(404)
        .json({ error: "Non sono state trovate date in candles." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
*/

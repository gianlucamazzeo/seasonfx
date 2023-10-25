const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const CurrencyData = require("./models/currencyDataSet"); // Assicurati di utilizzare il percorso corretto

mongoose.connect("mongodb://localhost:27017/fx", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


  const pair = "EUR_USD"; //req.body.name;
  //    const fromData = req.body.fromData;
  //    const toData = req.body.toData;
  //    const granularity = req.body.granularity;

  const currencyPair =
    "62fcf92818e12464410e7b18"; /* Currency.findOne({      name: pair,     }); */

  /*
    if (!currencyPair) {
      return res.status(400).json({ msg: `Non esiste la valuta ${pair}` });
    }
    */

    const Pair = require('./models/currencyDataSet');
  // Codice per l'importazione del CSV
  fs.createReadStream('EURUSD_010113_141023.csv')
  .pipe(csv())
  .on('data', (row) => {
    const newCandle = {
      complete: true,
      volume: 0,
      time: new Date(row.Date),
      ask: {
        o: mongoose.Types.Decimal128.fromString(row.Open),
        h: mongoose.Types.Decimal128.fromString(row.High),
        l: mongoose.Types.Decimal128.fromString(row.Low),
        c: mongoose.Types.Decimal128.fromString(row.Close),
      },
    };

    Pair.findOne({ "candles.time": newCandle.time })
      .then((existingCandle) => {
        if (!existingCandle) {
          // L'oggetto newCandle non esiste ancora, esegui l'aggiornamento
          Pair.updateOne(
            { _id: '62fcf92818e12464410e7b18' }, // Assicurati di impostare l'ID corretto
            { $push: { candles: newCandle } }
          )
            .then(() => {
              console.log("Nuovo candle aggiunto con successo per la data: " + newCandle.time);
            })
            .catch((err) => {
              console.error("Errore:", err);
            });
        } else {
          console.log("Candle con la stessa data già esiste.");
        }
      })
      .catch((err) => {
        console.error("Errore:", err);
      });
  })
  .on('end', () => {
    console.log('Importazione completata.');
   // mongoose.connection.close(); // Chiudi la connessione al database quando hai finito
  })

const Currency = require("../models/currency");
const CurrencyDataSet = require("../models/currencyDataSet");
const slugify = require("slugify");
const { getDataByOanda } = require("../oanda");



exports.create = async (req, res) => {
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

    const response = await getDataByOanda({
      endpoint: "instruments",
      pair: pair,
      fromData: fromData,
      toData: toData,
      granularity: granularity,
      price: "A",
    });

    // console.log(JSON.stringify(response.candles))
    const c = JSON.parse(response);
    //   console.log(c)

    const createRange = (fromDate, toDate) => {
      const fromDateSplit = fromDate.split("-");
      const toDateSplit = toDate.split("-");

      let fromDateTimestamp = new Date(
        fromDateSplit[0],
        fromDateSplit[1] - 1,
        fromDateSplit[2].substring(0, 2),
        "22",
        "00",
        "00",
        "00"
      );
      let toDateTimestamp = new Date(
        toDateSplit[0],
        toDateSplit[1] - 1,
        toDateSplit[2].substring(0, 2),
        "22",
        "00",
        "00",
        "00"
      );

      let ustart = fromDateTimestamp.getTime();
      let uend = toDateTimestamp.getTime();
      let newDataCandles = [];

      for (unix = ustart; unix <= uend; unix += 86400000) {
        let thisDay = new Date(unix);
        let d = thisDay.toISOString();
        //  let d = thisDay.toString().substring(0,10);

        let dataCandles = c.candles.filter(
          (o) => o.time.substring(0, 10) === d.substring(0, 10)
        );

        if (dataCandles.length > 0) {
          newDataCandles.push(dataCandles[0]);
        }
      }

      return newDataCandles;
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
        newObjData,
        {
          new: true,
          upsert: true,
        }
      ).exec();

      res.status(200).send(JSON.stringify(eleCur));
    } else {
      periodCandles.map((e) => {
        CurrencyDataSet.updateOne(
          { _id: currencyPair._id, "candles.time": { $ne: e.time } },
          { $push: { candles: periodCandles } },
          function (err, result) {
            if (err) {
              //  res.send(err);
            } else {
            }
          }
        );
      });

      res.send(periodCandles);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Create product failed" + err);
  }
};

exports.list = async (req, res) =>
res.json(await Currency.find({}).sort({ createdAt: -1 }).exec());



exports.all = async (req, res) => 
res.json(await Currency.find({ id: "62fcf92818e12464410e7b18"})
.populate(CurrencyDataSet)
.exec());


//  trova il candles.time più recente
exports.getMostRecentDate = async (req, res) => {

  try {
   
      const result = await CurrencyDataSet.aggregate([
        { $unwind: "$candles" },
        {
            $lookup: {
                from: "currencies", // nome della collezione da cui unire
                localField: "_id", // campo nella collezione corrente (CurrencyDataSet)
                foreignField: "_id", // campo nella collezione da cui unire (currencies)
                as: "currencyInfo" // nome dell'array in cui verranno inseriti i risultati uniti
            }
        },
        { $unwind: "$currencyInfo" }, // Poiché $lookup restituisce un array, $unwind lo "apre" per ottenere un oggetto
        { $sort: { "candles.time": -1 } },
        { $limit: 1 },
        {
            $project: { // Seleziona solo i campi che ti interessano
                "candles.time": 1,
                "currencyName": "$currencyInfo.name"
            }
        }
    ]).exec();
   

      if (result.length > 0) {
          res.status(200).json( { mostRecentDate: result[0].candles.time, curName: result[0].currencyName } );
      } else {
          res.status(404).json({ error: "Non sono state trovate date in candles." });
      }
  } catch (err) {
    console.log(err);
      res.status(500).json({ error: err.message });
  }
}




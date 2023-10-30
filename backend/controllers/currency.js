const Currency = require("../models/currency");
const Pair = require("../models/currencyDataSet");
const slugify = require("slugify");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    // const category = await new Category({ name, slug: slugify(name) }).save();
    // res.json(category);
    res.json(await new Currency({ name, slug: slugify(name) }).save());
  } catch (err) {
    console.log(err);
    res.status(400).send("Create category failed");
  }
};

exports.readLocal = async (req, res) => {
  try {
    const { id, fromData, toData, granularity } = req.params;
    let from7YearAgo = fromData.substring(0, 4) - 8;
    let newFromData7 = from7YearAgo + "-" + fromData.substring(5, 10);

    let to1YearAgo = toData.substring(0, 4) - 1;
    let newToData1 = to1YearAgo + "-" + toData.substring(5, 10);


    let dataRes = Pair.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $match: {
          candles: {
            $elemMatch: {
              time: {
                $gte: new Date(newFromData7 + "T00:00:00.000Z"),
                $lt: new Date(newToData1 + "T23:59:59.000Z"),
              },
            },
          },
        },
      },
      { $unwind: "$candles" },
      {
        $match: {
          "candles.time": {
            $gte: new Date(newFromData7 + "T00:00:00.000Z"),
            $lt: new Date(newToData1 + "T23:59:59.000Z"),
          },
        },
      },
      { $group: { _id: { _id: "$_id" }, candles: { $push: "$candles" } } },
      { $project: { _id: "$_id._id", candles: 1 } },
    ]).exec((err, list) => {
      if (err) throw err;

      const lastYear = new Date().getFullYear() - 1; // Anno scorso

      const twoYearsAgo = lastYear - 1; // due anni fa
      const media2Period = list[0].candles.filter((candle) => {
        const candleYear = new Date(candle.time).getFullYear();
        return candleYear >= twoYearsAgo && candleYear <= lastYear;
      });


      const threeYearsAgo = lastYear - 2; // Tre anni fa
      const media3Period = list[0].candles.filter((candle) => {
        const candleYear = new Date(candle.time).getFullYear();
        return candleYear >= threeYearsAgo && candleYear <= lastYear;
      });

      const fiveYearsAgo = lastYear - 4; // Cinque anni fa
      const media5Period = list[0].candles.filter((candle) => {
        const candleYear = new Date(candle.time).getFullYear();
        return candleYear >= fiveYearsAgo && candleYear <= lastYear;
      });

      const sevenYearsAgo = lastYear - 6; // Sette anni fa
      const media7Period = list[0].candles.filter((candle) => {
        const candleYear = new Date(candle.time).getFullYear();
        return candleYear >= sevenYearsAgo && candleYear <= lastYear;
      });

      let r = {
        media2: media2Period,
        media3: media3Period,
        media5: media5Period,
        media7: media7Period,
      };
      res.json(r);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Get dataPair failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Currency.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  let currency = await Currency.findOne({ slug: req.params.slug }).exec();
  res.json(currency);
};

exports.dataDay = async (req, res) => {
  // Function to convert date string to ISO date object
  const convertToISODateFrom = (dateString) => {
    // Append time part to the date string
    const isoString = `${dateString}T00:00:00Z`;
    const dateObj = new Date(isoString);
    // Create a new Date object
    dateObj.setTime(dateObj.getTime() - 24 * 60 * 60 * 1000);
    return new Date(dateObj);
  };

  const convertToISODateTo = (dateString) => {
    // Append time part to the date string
    const isoString = `${dateString}T23:59:59Z`;
    const dateObj = new Date(isoString);
    // Create a new Date object
    dateObj.setTime(dateObj.getTime() - 24 * 60 * 60 * 1000);
    // Create a new Date object
    return new Date(dateObj);
  };

  try {
    const { id, fromData, toData, granularity } = req.params;

    let startDateF = convertToISODateFrom(fromData); //new Date(formattedDate + "T00:00:00.000Z");
    let endDateF = convertToISODateTo(toData); //new Date(formattedDate + "T23:59:59.999Z");

    const result = await Pair.aggregate([
      {
        $match: {
          "candles.time": {
            $gte: startDateF,
            $lt: endDateF,
          },
        },
      },
      {
        $project: {
          candles: {
            $filter: {
              input: "$candles",
              as: "candle",
              cond: {
                $and: [
                  { $gte: ["$$candle.time", startDateF] },
                  { $lt: ["$$candle.time", endDateF] },
                ],
              },
            },
          },
        },
      },
    ]).exec();

    // Extract the first candle object from the response
    const firstCandle = result[0].candles[0];
    /// update candles

    /*
    const addDays = (date, days) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    };
    const newObjectId = new mongoose.Types.ObjectId();

    // Modify the 'time' field to make it 3 days later
    let newtimeMore3 = addDays(new Date(firstCandle.time), 3);
    let newtimeMore2 = addDays(new Date(firstCandle.time), 2);
 //   let newtimeMore1 = addDays(new Date(firstCandle.time), 1);

    const newCandle3 = {
      complete: firstCandle.complete,
      volume: firstCandle.volume,
      time: newtimeMore3,
      ask: {
        o: firstCandle.ask.o,
        h: firstCandle.ask.h,
        l: firstCandle.ask.l,
        c: firstCandle.ask.c,
      },
      _id: newObjectId,
    };
    
    const newCandle2 = {
      complete: firstCandle.complete,
      volume: firstCandle.volume,
      time: newtimeMore2,
      ask: {
        o: firstCandle.ask.o,
        h: firstCandle.ask.h,
        l: firstCandle.ask.l,
        c: firstCandle.ask.c,
      },
      _id: newObjectId,
    };
    */
    /*
    const newCandle1 = {
      complete: firstCandle.complete,
      volume: firstCandle.volume,
      time: newtimeMore1,
      ask: {
        o: firstCandle.ask.o,
        h: firstCandle.ask.h,
        l: firstCandle.ask.l,
        c: firstCandle.ask.c,
      },
      _id: newObjectId,
    };
*/
    //    const newCandles = [newCandle2,  newCandle3];

    //   console.log(JSON.stringify(newCandle, null, 2));
    // Convert the Date object to YYYY-MM-DD format
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Check if a candle with the same time already exists
    /*
    newCandles.forEach((newCandle) => {
    //  console.log(newCandle)
    Pair.findOne({ "candles.time": formatDate(newCandle.time) })
      .then((existingCandle) => {

        
      //  console.log("existingCandle", formatDate(newCandle.time), newCandle)

        if (!existingCandle) {
          // If the candle does not exist, perform the updateOne operation
          
          Pair.updateOne(
            { _id: id },
            { $push: { candles: newCandle } }
          )
            .then(() => {
              console.log("New candle added successfully." + newCandle.time);
            })
            .catch((err) => {
              console.error("Error:", err);
            });
            
        } else {
          console.log("Candle with the same time already exists.");
        }
        
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    ///
   
  })
  */
    // Fai qualcosa con l'array "candles" risultante
  } catch (error) {
    console.log(error);
  }

  //let getDataDay = await
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Currency.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Create update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Currency.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Create delete failed");
  }
};

exports.readSingleData = async (req, res) => {
  try {
    const { id, fromData, toData, granularity } = req.params;
    const formatDate = fromData.substring(0, 4);
    const formattedDate = new Date(formatDate); // Converte la data in oggetto Date

    const result = Pair.aggregate([
      {
        $match: {
          "candles.time": formattedDate,
        },
      },
      {
        $project: {
          candles: {
            $filter: {
              input: "$candles",
              as: "candle",
              cond: {
                $eq: ["$$candle.time", formattedDate],
              },
            },
          },
        },
      },
    ]);

    // Fai qualcosa con l'array "candles" risultante
  } catch (error) {
    console.error(error);
    // Gestisci l'errore
  }
};

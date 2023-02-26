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

    console.log(req.params);

    const { id, fromData, toData, granularity } = req.params;
    let from7YearAgo = fromData.substring(0, 4) - 7;
    let from6YearAgo = fromData.substring(0, 4) - 6;
    let from5YearAgo = fromData.substring(0, 4) - 5;
    let from4YearAgo = fromData.substring(0, 4) - 4;
    let from3YearAgo = fromData.substring(0, 4) - 3;
    let from2YearAgo = fromData.substring(0, 4) - 2;
    let from1YearAgo = fromData.substring(0, 4) - 1;

    let newFromData7 = from7YearAgo + "-" + fromData.substring(5, 10);
    let newFromData6 = from6YearAgo + "-" + fromData.substring(5, 10);
    let newFromData5 = from5YearAgo + "-" + fromData.substring(5, 10);
    let newFromData4 = from4YearAgo + "-" + fromData.substring(5, 10);
    let newFromData3 = from3YearAgo + "-" + fromData.substring(5, 10);
    let newFromData2 = from2YearAgo + "-" + fromData.substring(5, 10);
    let newFromData1 = from1YearAgo + "-" + fromData.substring(5, 10);

    let to7YearAgo = toData.substring(0, 4) - 7;
    let to6YearAgo = toData.substring(0, 4) - 6;
    let to5YearAgo = toData.substring(0, 4) - 5;
    let to4YearAgo = toData.substring(0, 4) - 4;
    let to3YearAgo = toData.substring(0, 4) - 3;
    let to2YearAgo = toData.substring(0, 4) - 2;
    let to1YearAgo = toData.substring(0, 4) - 1;
    let toYearAgo = toData.substring(0, 4);

    let newToData0 = toYearAgo + "-" + toData.substring(5, 10);
    let newToData1 = to1YearAgo + "-" + toData.substring(5, 10);
    let newToData2 = to2YearAgo + "-" + toData.substring(5, 10);
    let newToData3 = to3YearAgo + "-" + toData.substring(5, 10);
    let newToData4 = to4YearAgo + "-" + toData.substring(5, 10);
    let newToData5 = to5YearAgo + "-" + toData.substring(5, 10);
    let newToData6 = to6YearAgo + "-" + toData.substring(5, 10);
    let newToData7 = to7YearAgo + "-" + toData.substring(5, 10);

    //   let dataResponse = await Pair.findById(id).exec();

//    console.log(new Date(newFromData7 + "T22:00:00.000Z"));
//    console.log(new Date(newToData7 + "T22:00:00.000Z"));

    let dataRes = Pair.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $match: {
          candles: {
            $elemMatch: {
              time: {
                $gte: new Date(newFromData7 + "T22:00:00.000Z"),
                $lt: new Date(newToData1 + "T22:00:00.000Z"),
              },
            },
          },
        },
      },
      { $unwind: "$candles" },
      {
        $match: {
          "candles.time": {
            $gte: new Date(newFromData7 + "T22:00:00.000Z"),
            $lt: new Date(newToData1 + "T22:00:00.000Z"),
          },
        },
      },
      { $group: { _id: { _id: "$_id" }, candles: { $push: "$candles" } } },
      { $project: { _id: "$_id._id", candles: 1 } },
    ]).exec((err, list) => {
      if (err) throw err;
      const data3splitFrom = newFromData3.split('-');
      const data1splitTo = newToData1.split('-');
      const data5splitFrom = newFromData5.split('-');
      const data7splitFrom = newFromData7.split('-');
     
      const media3Period = list[0].candles.filter(obj => {
        const date = new Date(obj.time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // i mesi in JS partono da 0 (gennaio) e finiscono a 11 (dicembre)
        const day = date.getDate();
        return year >= data3splitFrom[0] && year <= data1splitTo[0] && month >= parseInt(data3splitFrom[1],10) && month <= parseInt(data1splitTo[1],10) && day >= parseInt(data3splitFrom[2],10) && day <= parseInt(data1splitTo[1],10);
      });

      let media5Period = list[0].candles.filter((obj) => {
        const date = new Date(obj.time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // i mesi in JS partono da 0 (gennaio) e finiscono a 11 (dicembre)
        const day = date.getDate();        
        return year >= data5splitFrom[0] && year <= data1splitTo[0] && month >= parseInt(data5splitFrom[1],10) && month <= parseInt(data1splitTo[1],10) && day >= parseInt(data5splitFrom[2],10) && day <= parseInt(data1splitTo[1],10);

      });

      let media7Period = list[0].candles.filter((obj) => {
        const date = new Date(obj.time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // i mesi in JS partono da 0 (gennaio) e finiscono a 11 (dicembre)
        const day = date.getDate();        
        return year >= data7splitFrom[0] && year <= data1splitTo[0] && month >= parseInt(data7splitFrom[1],10) && month <= parseInt(data1splitTo[1],10) && day >= parseInt(data7splitFrom[2],10) && day <= parseInt(data1splitTo[1],10);
      });



    

      //  console.log(media5Period);

      let r = {
        media3: media3Period,
        media5: media5Period,
        media7: media7Period,
      };
      res.json(r);
    
    })
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

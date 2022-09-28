const Currency = require("../models/currency");
const Pair = require("../models/currencyDataSet");
const slugify = require("slugify");
const mongoose = require('mongoose');

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
       console.log(req.params)
    const { id, fromData, toData, granularity } = req.params;
 //   let dataResponse = await Pair.findById(id).exec();

      
        let dataRes =   Pair.aggregate([
                                    { $match: {_id: mongoose.Types.ObjectId(id)}},
                                     {$match: {candles: {$elemMatch: {time: { $gte: new Date(fromData + 'T22:00:00.000Z'), $lt: new Date(toData + 'T22:00:00.000Z') }}}}},
                                     { $unwind: "$candles" },
                                    {$match:{"candles.time": { $gte: new Date(fromData + 'T22:00:00.000Z'), $lt: new Date(toData + 'T22:00:00.000Z') } }},
                                    {$group: { _id: { _id: "$_id" }, candles: {$push: "$candles" } } },
                                    {$project: {_id: "$_id._id",  candles: 1 } }
                                    ]).exec((err, list) => {
                                      if (err) throw err;
                                      res.json(list);
                                    });

    

   //   console.log(dataRes)




    //   const { name } = req.params;
    // const category = await new Category({ name, slug: slugify(name) }).save();
    // res.json(category);
    //    res.json(await new Currency({ name, slug: slugify(name) }).save());
   
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

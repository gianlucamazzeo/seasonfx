const Currency = require("../models/currency");
const slugify = require("slugify");

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
  
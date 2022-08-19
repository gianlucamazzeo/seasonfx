const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      minlength: [7, "Too short"],
      maxlength: [7, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Currency", currencySchema);
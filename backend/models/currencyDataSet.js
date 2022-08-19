const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
   
    currency: {
      type: ObjectId,
      ref: "Currency",
    },
    granularity: {
        type: String,
        enum: ["D", "H4"]
    },
    candles: [
        {
            complete: Boolean,
            volume: Number,
            time: Date,
            ask: {
                o: mongoose.Decimal128,
                h: mongoose.Decimal128,
                l: mongoose.Decimal128,
                c: mongoose.Decimal128
            }
        }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
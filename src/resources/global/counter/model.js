const mongoose = require("mongoose");
const counterSchema = new mongoose.Schema(
  {
    accountAdmin: {
      type: mongoose.Schema.ObjectId,
    },

    name: {
      type: String,
    },

    counter: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;

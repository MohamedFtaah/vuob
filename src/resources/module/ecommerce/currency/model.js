const mongoose = require('mongoose');
const CurrencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    val: {
      type: Number,
      required: true,
      default: 1,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
CurrencySchema.index(
  { isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);
const Currency = mongoose.model('Currency', CurrencySchema);
module.exports = Currency;

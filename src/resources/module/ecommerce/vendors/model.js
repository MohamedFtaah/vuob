const mongoose = require("mongoose");
const frontVendors = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

frontVendors.pre(/^find/, function (next) {
  this.populate({
    path: "vendor",
    select: "name email",
  });

  next();
});

const Vendor = mongoose.model("Vendor", frontVendors);
module.exports = Vendor;

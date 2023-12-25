const mongoose = require("mongoose");
const SettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Setting must has a name , يجب أن يحتوي الضبط  علي اسم"],
      unique: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [
        true,
        "Setting must has an value , يجب أن يحتوي الضبط علي قيمة",
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
const Setting = mongoose.model("Setting", SettingSchema);
module.exports = Setting;

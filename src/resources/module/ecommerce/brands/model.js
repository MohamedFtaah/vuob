const mongoose = require('mongoose');

// langs
const { langs } = require('../../../lang');

// default data
const defaultData = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
});

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand must has a name*#*يجب أن تحتوي الماركة علي اسم'],
      unique: true,
      trim: true,
    },
    img: {
      type: String,
      required: [
        true,
        'Brand must has an image*#*يجب أن تحتوي الماركة علي صورة',
      ],
    },
    front: {
      type: Boolean,
      default: false,
    },
    translation: {
      type: Map,
      of: defaultData,
      validate: {
        validator: function (v) {
          const keys = Array.from(v.keys());
          return keys.every((key) => langs.includes(key));
        },
        message: () => 'Unsupported Language*#*لغة غير مدعومة',
      },
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', BrandSchema);
module.exports = Brand;

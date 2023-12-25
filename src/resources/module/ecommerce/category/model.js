const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'Category must has an arabic name , يجب أن تحتوي الفئة علي اسم باللغة العربية',
      ],
      unique: true,
      trim: true,
    },

    img: {
      type: String,
      required: [
        true,
        'Category must has an image , يجب أن تحتوي الفئة علي  صورة',
      ],
    },

    subs: [
      {
        type: String,
        unique: true,
        trim: true,
      },
    ],

    enabled: {
      type: Boolean,
      default: true,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;

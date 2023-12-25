const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: [
        true,
        'Slide must has an link*#*يجب أن تحتوي الشريحة علي رابط',
      ],

      trim: true,
    },

    img: {
      type: String,
      required: [true, 'Slide must has an img*#*يجب أن تحتوي الشريحة علي صورة'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Slide = mongoose.model('Slide', SlideSchema);
module.exports = Slide;

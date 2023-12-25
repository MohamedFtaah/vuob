const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: [true, 'Message must has an text*#*يجب أن تحتوي الرسال علي نص'],
      unique: true,
      trim: true,
    },

    link: {
      type: String,
      required: [
        true,
        'Message must has an link*#*يجب أن تحتوي الرسال علي صورة',
      ],
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

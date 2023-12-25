const mongoose = require('mongoose');

// langs
const { langs } = require('../../../lang');

// default data
const defaultData = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  props: [
    {
      type: String,
      unique: true,
      trim: true,
    },
  ],
});

const PropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'Prop must has an group name , يجب أن تحتوي المجموعة علي اسم',
      ],
      unique: true,
      trim: true,
    },

    props: [
      {
        type: String,
        required: [
          true,
          'Prop must has a value , يجب أن تحتوي المجموعة علي قيمة',
        ],
        unique: true,
        trim: true,
      },
    ],
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

const Props = mongoose.model('Prop', PropSchema);
module.exports = Props;

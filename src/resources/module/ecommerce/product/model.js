const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const ProductSchema = new mongoose.Schema(
  {
    name: {
      ar: {
        type: String,
        required: [
          true,
          'Product must has an arabic name*#*يجب أن يحتوي المنتج علي اسم باللغة العربية',
        ],
        unique: true,
        trim: true,
      },
      'en-US': {
        type: String,
        required: [
          true,
          'Product must has an english name*#*يجب أن يحتوي المنتج علي اسم باللغة الانجليزية',
        ],
        unique: true,
        trim: true,
      },
    },

    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Product must has a vendor*#*يجب أن يكون المنتج لتاجر'],
    },

    description: {
      ar: {
        type: String,
        required: [
          true,
          'Product must has an arabic description*#*يجب أن يحتوي المنتج علي وصف باللغة العربية',
        ],
        unique: true,
        trim: true,
      },
      'en-US': {
        type: String,
        required: [
          true,
          'Product must has an english description*#*يجب أن يحتوي المنتج علي وصف باللغة الانجليزية',
        ],
        unique: true,
        trim: true,
      },
    },

    brand: {
      ar: {
        type: String,
        required: [
          true,
          'Product must has an arabic brand*#*يجب أن يحتوي المنتج علي ماركة باللغة العربية',
        ],
        unique: true,
        trim: true,
      },
      'en-US': {
        type: String,
        required: [
          true,
          'Product must has an english brand*#*يجب أن يحتوي المنتج علي ماركة باللغة الانجليزية',
        ],
        unique: true,
        trim: true,
      },
    },

    category: {
      ar: {
        type: String,
        required: [
          true,
          'Product must has an arabic category*#*يجب أن يحتوي المنتج علي فئة باللغة العربية',
        ],
        unique: true,
        trim: true,
      },
      'en-US': {
        type: String,
        required: [
          true,
          'Product must has an english category*#*يجب أن يحتوي المنتج علي فئة باللغة الانجليزية',
        ],
        unique: true,
        trim: true,
      },
      subs: [
        {
          ar: {
            type: String,
            unique: true,
            trim: true,
          },
          'en-US': {
            type: String,
            unique: true,
            trim: true,
          },
        },
      ],
    },

    discount: {
      type: Number,
      default: 0,
    },

    props: [
      {
        ar: {
          type: String,

          unique: true,
          trim: true,
        },
        'en-US': {
          type: String,
          unique: true,
          trim: true,
        },
        props: [
          {
            ar: {
              type: String,

              unique: true,
              trim: true,
            },
            'en-US': {
              type: String,
              unique: true,
              trim: true,
            },
          },
        ],
      },
    ],
    price: {
      type: Number,
      required: [
        true,
        'Product must has a price*#*يجب أن يحتوي المنتج علي سعر',
      ],
    },
    priceAfter: {
      type: Number,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    unit: {
      ar: {
        type: String,
        required: [
          true,
          'Product must has an arabic unit*#*يجب أن يحتوي المنتج علي وحدة باللغة العربية',
        ],
        unique: true,
        trim: true,
      },
      'en-US': {
        type: String,
        required: [
          true,
          'Product must has an english unit*#*يجب أن يحتوي المنتج علي وحدة باللغة الانجليزية',
        ],
        unique: true,
        trim: true,
      },
    },

    imgs: {
      type: Array,
    },

    card_img: {
      type: Number,
      default: 0,
    },

    tags: {
      type: Array,
      default: ['product'],
    },

    speical_status: {
      type: String,
      enum: ['onSale', 'new', 'none', 'offer', 'bestSeller'],
      default: 'none',
    },

    min: {
      type: Number,
      default: 1,
    },

    max: {
      type: Number,
      default: 150,
    },

    totalRating: {
      type: Number,
    },

    totalUsersRate: {
      type: Number,
    },

    comments: [
      {
        type: mongoose.Schema.ObjectId,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

ProductSchema.pre('save', function (next) {
  this.priceAfter = this.price - (this.price * this.discount) / 100;
  next();
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'vendor',
    select: 'name',
  });
  next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

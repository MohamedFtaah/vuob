//Libraries
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const modulesSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['estore', 'supplyChain', 'library', 'employment'],
  },

  status: {
    type: Boolean,
    default: true,
  },

  type: [
    {
      type: String,
      enum: ['buyer', 'seller', 'vendor'],
    },
  ],

  role: {
    type: String,
    enum: ['user', 'admin'],
  },

  rules: [
    {
      type: String,
    },
  ],

  info: Object,

  validDate: Date,
});

const UserSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'User must has a type*#*يجب أن يملك المستخدم نوع '],
      enum: ['user', 'superAdmin'],
      default: 'user',
    },

    modules: [modulesSchema],

    name: {
      type: String,
      required: [true, 'User must has a name*#*يجب أن يملك المستخدم أسم '],
    },

    email: {
      type: String,
      required: [
        true,
        'Please enter an email*#*من فضلك قم بأدخال حسابك الشخصي',
      ],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (e) {
          return validator.isEmail(e);
        },
        message:
          'You must provide a vaild email*#*يجب ان تقوم بادخال حساب صحيح',
      },
    },

    phone: {
      type: String,
      required: [
        true,
        'Please enter a phone number*#*من فضلك قم بأدخال رقم هاتف',
      ],
      validate: {
        validator: function (p) {
          return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(
            p
          );
        },
        message: 'You must provide a vaild phone*#*من فضلك ادخل رقم هاتف صحيح',
      },
    },
    phoneCode: {
      type: String,
      enum: ['+20', '+966'],
    },

    // https://www.npmjs.com/package/password-validator
    password: {
      type: String,
      required: [true, 'Please enter a password*#*من فضلك قم بأدخال كلمة مرور'],
      minlength: [
        8,
        "Your Password canno't be shorter than 8 characters*#*يجب ان لا تقل كلمة المرور عن 8 أحرف أو أرقام",
      ],
    },

    passwordConfirm: {
      type: String,
      required: [
        true,
        'Please confirm your password*#*من فضلك قم بتأكيد كلمة مرور',
      ],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords dosn't match*#*كلمات المرور غير متشابهة",
      },
    },

    status: {
      type: Boolean,
      default: true,
    },

    accountAdmin: mongoose.Schema.ObjectId,

    accountCode: String,

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetTokenExpire: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//hash password
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

//update the time that passoword changed at
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//check that password is correct
UserSchema.methods.correctPassword = async function (
  candidatePasssword,
  userPassword
) {
  return await bcrypt.compare(candidatePasssword, userPassword);
};

//create reset password token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

//check that the jwt is valid
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

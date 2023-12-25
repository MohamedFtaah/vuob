const mongoose = require("mongoose");
const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "Permission must has a name , يجب أن تحتوي مجموعة الصلاحيات علي اسم",
      ],
      unique: true,
    },

    desc: {
      type: String,
      required: [
        true,
        "Permission must has an description , يجب أن تحتوي مجموعة الصلاحيات علي وصف",
      ],
    },
    permissions: [
      {
        type: String,
        enum: [],
      },
    ],

    accountAdmin : {
      type : mongoose.Schema.ObjectId,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
const Permission = mongoose.model("Permission", PermissionSchema);
module.exports = Permission;

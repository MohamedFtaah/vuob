const mongoose = require("mongoose");
const crypto = require("crypto");

const schemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "list must has a name ,يجب ان تحتوى القائمة على اسم"],
      unique: true,
    },
    desc: {
      type: String,
      maxLength: 255,
    },
    default: {
      type: Boolean,
      default: false,
    },

    enabled: {
      type: Boolean,
      default: false,
    },
    done: {
      type: Boolean,
      default: false,
    },

    header: [
      {
        name: {
          type: String,
        },
        dataType: {
          type: String,
          enum: ["String", "Number", "Date", "Boolean", "Array", "File"],
        },
        validation: {
          action: {
            type: String,
            default: "",
          },
          val: {
            type: String,
            default: "",
          },
          label: {
            type: String,
            default: "without",
          },
          hasValue: {
            type: String,
            default: null,
          },
        },
        superColumn: {
          super: {
            type: Boolean,
            default: false,
          },
          equ: {
            type: Array,
          },
        },
        inputType: { type: String },
        defaultValue: {
          label: {
            type: String,
            enum: ["Value", "Logged User", "Today Date"],
          },
          value: {
            type: String,
          },
          model: {
            type: Array,
            default: [],
          },
        },
        required: {
          type: Boolean,
          default: false,
        },
        editable: {
          type: Boolean,
          default: false,
        },
        defaultColumn: {
          type: Boolean,
          default: false,
        },
        flag: {
          type: String,
          enum: ["RFQ", "OFFER", "PO", "INVOICE", "DEFAULT"],
          required: [true, ""],
        },
      },
    ],

    item: [
      {
        name: {
          type: String,
        },
        dataType: {
          type: String,
          enum: ["String", "Number", "Date", "Boolean", "Array", "File"],
        },
        validation: {
          action: {
            type: String,
            default: "",
          },
          val: {
            type: String,
            default: "",
          },
          label: {
            type: String,
            default: "without",
          },
          hasValue: {
            type: String,
            default: null,
          },
        },
        superColumn: {
          super: {
            type: Boolean,
            default: false,
          },
          equ: {
            type: Array,
          },
        },
        inputType: { type: String },
        defaultValue: {
          label: {
            type: String,
            enum: ["Value", "Logged User", "Today date"],
          },
          value: {
            type: String,
          },
          model: {
            type: Array,
            default: [],
          },
        },
        required: {
          type: Boolean,
          default: false,
        },
        editable: {
          type: Boolean,
          default: false,
        },
        defaultColumn: {
          type: Boolean,
          default: false,
        },
        flag: {
          type: String,
          enum: ["RFQ", "OFFER", "PO", "INVOICE", "DEFAULT"],
          required: [true, ""],
        },
      },
    ],

    key: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// listSchema.pre('save' , async function(next) {
//     this.key = crypto.randomBytes(32).toString("hex");
//     next();
// })

const Schema = mongoose.model("Schema", schemaSchema);
module.exports = Schema;

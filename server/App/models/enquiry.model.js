let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let enquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      // Stored as String so leading zeros / special chars are preserved
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

let enquiryModel = mongoose.model("Enquiry", enquirySchema);
module.exports = enquiryModel;
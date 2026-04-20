//models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  isBundle: Boolean,
  groupMembers: [
    {
      name: String,
      email: String,
      phone: String,
      competitionId: String,
    }
  ],
  pricePaid: Number,
  priceType: String,

  competitionId: String,
  tickets: [
    {
      name: String,
      phone: String,
      code: String,
      used: {
        type: Boolean,
        default: false
      }
    }
  ],
  paymentStatus: {
    type: String,
    default: "pending"
  },
  paymobOrderId: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
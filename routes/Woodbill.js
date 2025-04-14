const mongoose = require("mongoose");

const woodBillSchema = new mongoose.Schema({
  sapDate: String,
  billSubmitDate: String,
  quantity: Number,
  submitTime: String,
  receiver: String,
  depositer: String,
  plant: String
}, { timestamps: true });

module.exports = mongoose.model("WoodBill", woodBillSchema);

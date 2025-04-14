// models/ShiftReport.js
const mongoose = require("mongoose");

const shiftReportSchema = new mongoose.Schema({
  date: String,
  plant: String,
  shift: String,
  user: String,
  wood: {
    received: Number,
    sap: Number,
    pending: Number
  },
  store: {
    received: Number,
    sap: Number,
    pending: Number
  },
  dispatch: {
    received: Number,
    sap: Number,
    pending: Number
  },
  totalSapDone: Number,
  totalTokens: Number,
  inStockTokens: Number,
  issuedTokens: Number
}, { timestamps: true });

module.exports = mongoose.model("ShiftReport", shiftReportSchema);

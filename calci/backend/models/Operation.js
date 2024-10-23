const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  expression: { type: String, required: true },
  result: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Operation', operationSchema);

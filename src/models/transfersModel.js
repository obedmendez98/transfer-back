const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  origin_account: { type: String, required: true },
  id_origin_account: { type: String, required: true },
  destination_account: { type: String, required: true },
  transfer_date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
}, { collection: 'Transfers' });

module.exports = mongoose.model('Transfers', transferSchema);
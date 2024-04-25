const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  user_id: { type: String, required: true },
}, { collection: 'Account' });

module.exports = mongoose.model('Account', accountSchema);
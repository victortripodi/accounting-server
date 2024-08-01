const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = {
  Account
};


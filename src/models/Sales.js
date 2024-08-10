const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tax: { type: String, enum: ['exempt', '10%'], required: true }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = {
  Sales
};

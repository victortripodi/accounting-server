const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tax: { type: String, enum: ['exempt', '10%'], required: true }
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = {
  Expenses
};

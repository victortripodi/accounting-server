const mongoose = require('mongoose');
const { Schema } = mongoose;

const journalLineSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  journal: { type: Schema.Types.ObjectId, ref: 'Journal', required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  entryType: { type: String, enum: ['DR', 'CR'], required: true }
});

const JournalLine = mongoose.model('JournalLine', journalLineSchema);

module.exports = {
  JournalLine
};

const mongoose = require('mongoose');
const { Schema } = mongoose;

const journalSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = {
  Journal
};

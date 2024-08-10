const mongoose = require('mongoose');
const { Schema } = mongoose;

const entitySchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  name: { type: String, required: true },
  ABN: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  postcode: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['customer', 'vendor'], required: true }
});

const Entity = mongoose.model('Entity', entitySchema);

module.exports = {
  Entity
};

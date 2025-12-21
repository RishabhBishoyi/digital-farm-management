const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  animalId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  status: {
    type: String,
    enum: ['SAFE', 'UNSAFE'],
    default: 'SAFE',
  },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);

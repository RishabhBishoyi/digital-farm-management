const mongoose = require('mongoose');

const medicineStandardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  withdrawalDays: {
    type: Number,
    required: true,
  },
  applicableAnimals: [{
    type: String, // e.g., 'cow', 'goat'
  }]
}, { timestamps: true });

module.exports = mongoose.model('MedicineStandard', medicineStandardSchema);

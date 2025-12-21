const mongoose = require('mongoose');

const medicineUsageSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dateGiven: {
    type: Date,
    required: true,
    default: Date.now,
  },
  withdrawalDays: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('MedicineUsage', medicineUsageSchema);

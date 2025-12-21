const MedicineUsage = require('../models/MedicineUsage');
const Animal = require('../models/Animal');
const MedicineStandard = require('../models/MedicineStandard');

// @desc    Get available medicines for an animal type
// @route   GET /api/medicines/available/:type
// @access  Private
const getAvailableMedicines = async (req, res) => {
  try {
    const { type } = req.params;
    // Case insensitive search for animal type in the array
    const medicines = await MedicineStandard.find({
      applicableAnimals: { $in: [type.toLowerCase()] }
    });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add medicine usage
// @route   POST /api/medicines
// @access  Private
const addMedicineUsage = async (req, res) => {
  const { animalId, medicineName, notes } = req.body;

  if (!animalId || !medicineName) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    // Find animal
    const animal = await Animal.findOne({ animalId });
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Find medicine standard to get withdrawal days
    const medicineStandard = await MedicineStandard.findOne({ name: medicineName });
    
    // Default to 0 if not found, or handle error. 
    // Ideally we should have the medicine in DB.
    let withdrawalDays = 0;
    if (medicineStandard) {
        withdrawalDays = medicineStandard.withdrawalDays;
    } else if (medicineName.toLowerCase().includes('test')) {
        // Allow custom test medicines
        // Extract number if present, e.g., "Test 5" -> 5 minutes
        const match = medicineName.match(/\d+/);
        withdrawalDays = match ? parseInt(match[0]) : 1; // Default to 1 minute/day
    } else {
        // Fallback or error? Let's error for safety in this system
        return res.status(400).json({ message: 'Medicine not recognized in standard catalog.' });
    }

    const medicineUsage = await MedicineUsage.create({
      animal: animal._id,
      medicineName,
      withdrawalDays,
      notes,
      dateGiven: new Date(),
    });

    // Update animal status
    if (withdrawalDays > 0) {
        animal.status = 'UNSAFE';
        await animal.save();
    }

    res.status(200).json(medicineUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMedicineUsage,
  getAvailableMedicines
};

const Animal = require('../models/Animal');
const Farm = require('../models/Farm');
const MedicineUsage = require('../models/MedicineUsage');

// @desc    Get animals
// @route   GET /api/animals
// @access  Private
const getAnimals = async (req, res) => {
  try {
    // Find farm owned by user
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      // If no farm, return empty list or error. 
      // For a new user, maybe they haven't set up a farm yet.
      return res.status(200).json([]);
    }

    const animals = await Animal.find({ farm: farm._id });

    // Calculate status for each animal
    const animalsWithStatus = await Promise.all(animals.map(async (animal) => {
      const activeMedicines = await MedicineUsage.find({
        animal: animal._id,
      });

      let isUnsafe = false;
      let maxRemainingTime = 0;
      let remainingUnit = 'days';
      const currentDate = new Date();

      for (const usage of activeMedicines) {
        const withdrawalEndDate = new Date(usage.dateGiven);
        let isTestMedicine = false;
        
        // Check if medicine name contains "Test" (case-insensitive) for minute-based testing
        if (usage.medicineName && usage.medicineName.toLowerCase().includes('test')) {
            isTestMedicine = true;
            withdrawalEndDate.setMinutes(withdrawalEndDate.getMinutes() + usage.withdrawalDays);
        } else {
            withdrawalEndDate.setDate(withdrawalEndDate.getDate() + usage.withdrawalDays);
        }

        // If withdrawal period is over, delete the record from database
        if (currentDate >= withdrawalEndDate) {
            await MedicineUsage.findByIdAndDelete(usage._id);
            continue;
        }

        if (currentDate < withdrawalEndDate) {
          isUnsafe = true;
          const diffTime = Math.abs(withdrawalEndDate - currentDate);
          
          if (diffTime > maxRemainingTime) {
            maxRemainingTime = diffTime;
            remainingUnit = isTestMedicine ? 'minutes' : 'days';
          }
        }
      }

      const newStatus = isUnsafe ? 'UNSAFE' : 'SAFE';
      
      // Only update if changed to avoid unnecessary writes
      if (animal.status !== newStatus) {
          animal.status = newStatus;
          await animal.save();
      }

      let displayRemaining = 0;
      if (isUnsafe) {
          if (remainingUnit === 'minutes') {
              displayRemaining = Math.ceil(maxRemainingTime / (1000 * 60));
          } else {
              displayRemaining = Math.ceil(maxRemainingTime / (1000 * 60 * 60 * 24));
          }
      }

      return {
        ...animal.toObject(),
        daysRemaining: displayRemaining,
        remainingUnit
      };
    }));

    res.status(200).json(animalsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add animal
// @route   POST /api/animals
// @access  Private
const addAnimal = async (req, res) => {
  const { animalId, type, age, weight } = req.body;

  if (!animalId || !type || !age) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found. Please complete profile.' });
    }

    // Check if animal ID already exists
    const animalExists = await Animal.findOne({ animalId });
    if (animalExists) {
        return res.status(400).json({ message: 'Animal ID already exists' });
    }

    const animal = await Animal.create({
      animalId,
      type,
      age,
      weight,
      farm: farm._id,
    });

    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/animals/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.user.id });
    if (!farm) {
      return res.status(200).json({ totalAnimals: 0, unsafeAnimals: 0, status: 'SAFE' });
    }

    const animals = await Animal.find({ farm: farm._id });
    const animalIds = animals.map(a => a._id);
    
    const activeMedicines = await MedicineUsage.find({
        animal: { $in: animalIds }
    });

    let unsafeCount = 0;
    const currentDate = new Date();

    for (const animal of animals) {
        const animalMedicines = activeMedicines.filter(m => m.animal.toString() === animal._id.toString());
        let isUnsafe = false;
        for (const usage of animalMedicines) {
             const withdrawalEndDate = new Date(usage.dateGiven);
             withdrawalEndDate.setDate(withdrawalEndDate.getDate() + usage.withdrawalDays);
             if (currentDate < withdrawalEndDate) {
                 isUnsafe = true;
                 break;
             }
        }
        if (isUnsafe) unsafeCount++;
    }

    res.status(200).json({
        totalAnimals: animals.length,
        unsafeAnimals: unsafeCount,
        status: unsafeCount > 0 ? 'ATTENTION' : 'SAFE'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete animal
// @route   DELETE /api/animals/:id
// @access  Private
const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the animal owner (via Farm)
    const farm = await Farm.findOne({ owner: req.user.id });
    if (animal.farm.toString() !== farm._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete associated medicine usage records
    await MedicineUsage.deleteMany({ animal: animal._id });

    await animal.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnimals,
  addAnimal,
  getStats,
  deleteAnimal
};

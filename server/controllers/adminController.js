const Farm = require('../models/Farm');
const Animal = require('../models/Animal');
const User = require('../models/User');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalFarms = await Farm.countDocuments();
    const totalAnimals = await Animal.countDocuments();
    const unsafeAnimals = await Animal.countDocuments({ status: 'UNSAFE' });
    const totalUsers = await User.countDocuments({ role: 'farmer' });

    res.status(200).json({
      totalFarms,
      totalAnimals,
      unsafeAnimals,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all farms
// @route   GET /api/admin/farms
// @access  Private/Admin
const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate('owner', 'name email');
    
    // Add animal counts to each farm
    const farmsWithStats = await Promise.all(farms.map(async (farm) => {
        const animalCount = await Animal.countDocuments({ farm: farm._id });
        const unsafeCount = await Animal.countDocuments({ farm: farm._id, status: 'UNSAFE' });
        return {
            ...farm.toObject(),
            animalCount,
            unsafeCount
        };
    }));

    res.status(200).json(farmsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unsafe animals
// @route   GET /api/admin/unsafe
// @access  Private/Admin
const getGlobalUnsafeAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ status: 'UNSAFE' })
        .populate('farm', 'name location')
        .sort({ updatedAt: -1 });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllFarms,
  getGlobalUnsafeAnimals
};

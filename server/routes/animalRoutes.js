const express = require('express');
const router = express.Router();
const { getAnimals, addAnimal, getStats, deleteAnimal } = require('../controllers/animalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.route('/').get(protect, getAnimals).post(protect, addAnimal);
router.route('/:id').delete(protect, deleteAnimal);

module.exports = router;

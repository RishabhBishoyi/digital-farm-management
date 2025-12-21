const express = require('express');
const router = express.Router();
const { getAdminStats, getAllFarms, getGlobalUnsafeAnimals } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/farms', protect, adminOnly, getAllFarms);
router.get('/unsafe', protect, adminOnly, getGlobalUnsafeAnimals);

module.exports = router;

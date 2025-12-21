const express = require('express');
const router = express.Router();
const { addMedicineUsage, getAvailableMedicines } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addMedicineUsage);
router.get('/available/:type', protect, getAvailableMedicines);

module.exports = router;

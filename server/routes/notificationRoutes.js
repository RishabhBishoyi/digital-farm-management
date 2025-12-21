const express = require('express');
const router = express.Router();
const { sendNotification, getNotifications } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, sendNotification);
router.get('/', protect, getNotifications);

module.exports = router;

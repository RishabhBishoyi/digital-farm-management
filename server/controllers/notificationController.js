const Notification = require('../models/Notification');

// @desc    Send notification
// @route   POST /api/notifications
// @access  Private/Admin
const sendNotification = async (req, res) => {
  const { message, recipientId } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const notification = await Notification.create({
      message,
      sender: req.user.id,
      targetRole: recipientId ? 'individual' : 'farmer',
      recipient: recipientId || null
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    // Farmers see messages for 'farmer', 'all', or specifically for them
    const notifications = await Notification.find({
        $or: [
            { targetRole: { $in: ['farmer', 'all'] } },
            { recipient: req.user.id }
        ]
    }).sort({ createdAt: -1 }).limit(10);
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendNotification,
  getNotifications
};

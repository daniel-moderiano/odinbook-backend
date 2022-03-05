const express = require('express');
const router = express.Router();
const { handleFriendRequest } = require('../controllers/friendController');
const { protectRoute } = require('../middleware/authMiddleware');

// Post-specific routes
router.put('/:userId', protectRoute, handleFriendRequest);

module.exports = router;
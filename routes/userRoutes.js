const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUser, getUsers } = require('../controllers/userController');
const {protectRoute} = require('../middleware/authMiddleware');

router.get('/', protectRoute, getUsers)
router.get('/:userId', protectRoute, getUser)
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
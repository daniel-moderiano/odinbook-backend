const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, getUsers, deleteUser, updateUser } = require('../controllers/userController');
const {protectRoute} = require('../middleware/authMiddleware');

router.get('/', protectRoute, getUsers)
router.route('/:userId').get(protectRoute, getUser).delete(protectRoute, deleteUser).put(protectRoute, updateUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
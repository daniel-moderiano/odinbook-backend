const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, getUsers, deleteUser, updateUser, logoutUser } = require('../controllers/userController');
const {protectRoute} = require('../middleware/authMiddleware');

router.get('/', protectRoute, getUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.route('/:userId').get(protectRoute, getUser).delete(protectRoute, deleteUser).put(protectRoute, updateUser);

module.exports = router;
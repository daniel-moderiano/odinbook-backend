const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, getUsers, deleteUser, updateUser, logoutUser, getCurrentUser, getUserPosts, getUserFeed, getUserFriends, updateUserPic, loginTestUser } = require('../controllers/userController');
const {protectRoute} = require('../middleware/authMiddleware');

router.get('/', protectRoute, getUsers);
router.post('/login', loginUser);
router.post('/login/test', loginTestUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.get('/current', protectRoute, getCurrentUser);
router.route('/:userId').get(protectRoute, getUser).delete(protectRoute, deleteUser).put(protectRoute, updateUser);
router.route('/:userId/posts').get(protectRoute, getUserPosts);
router.route('/:userId/feed').get(protectRoute, getUserFeed);
router.route('/:userId/friends').get(protectRoute, getUserFriends);
router.route('/:userId/profile-pic').put(protectRoute, updateUserPic);

module.exports = router;
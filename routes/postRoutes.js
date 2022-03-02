const express = require('express');
const router = express.Router();
const { getPost, getPosts, addPost, updatePost, likePost, deletePost } = require('../controllers/postController');
const { getComment, getComments, addComment, updateComment, likeComment, deleteComment } = require('../controllers/commentController');
const { protectRoute } = require('../middleware/authMiddleware');

// Post-specific routes
router.route('/').get(getPosts).post(addPost);
router.route('/:postId').get(getPost).put(updatePost).delete(deletePost);
router.route('/:postId/likes').put(likePost);

// Comment-specific routes (using the post routes as a base route)
router.route('/:postId/comments').get(protectRoute, getComments).post(protectRoute, addComment);
router.route('/:postId/comments/:commentId').get(protectRoute, getComment).put(protectRoute, updateComment).delete(protectRoute, deleteComment);
router.route('/:postId/comments/:commentId/likes').put(protectRoute, likeComment);

module.exports = router;
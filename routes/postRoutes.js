const express = require('express');
const router = express.Router();
const { getPost, getAllPosts, addPost, updatePost, likePost, deletePost, getPostLikes } = require('../controllers/postController');
const { getComment, getComments, addComment, updateComment, likeComment, deleteComment, getCommentLikes } = require('../controllers/commentController');
const { protectRoute } = require('../middleware/authMiddleware');

// Post-specific routes
router.route('/').get(protectRoute, getAllPosts).post(protectRoute, addPost);
router.route('/:postId').get(protectRoute, getPost).put(protectRoute, updatePost).delete(protectRoute, deletePost);
router.route('/:postId/likes').get(protectRoute, getPostLikes).put(protectRoute, likePost);

// Comment-specific routes (using the post routes as a base route)
router.route('/:postId/comments').get(protectRoute, getComments).post(protectRoute, addComment);
router.route('/:postId/comments/:commentId').get(protectRoute, getComment).put(protectRoute, updateComment).delete(protectRoute, deleteComment);
router.route('/:postId/comments/:commentId/likes').get(protectRoute, getCommentLikes).put(protectRoute, likeComment);

module.exports = router;
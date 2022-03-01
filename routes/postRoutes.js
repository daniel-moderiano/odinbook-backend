const express = require('express');
const router = express.Router();
const { getPost, getPosts, addPost, updatePost, likePost, deletePost } = require('../controllers/postController');
const { getComment, getComments, addComment, updateComment, likeComment, deleteComment } = require('../controllers/commentController');

// Post-specific routes
router.route('/').get(getPosts).post(addPost);
router.route('/:postId').get(getPost).put(updatePost).delete(deletePost);
router.route('/:postId/likes').put(likePost);

// Comment-specific routes (using the post routes as a base route)
router.route('/:postId/comments').get(getComments).post(addComment);
router.route('/:postId/comments/:commentId').get(getComment).put(updateComment).delete(deleteComment);
router.route('/:postId/comments/:commentId/likes').put(likeComment);

module.exports = router;
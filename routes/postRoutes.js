const express = require('express');
const router = express.Router();
const { getPost, getPosts, addPost, updatePost, likePost, deletePost } = require('../controllers/postController');

router.route('/').get(getPosts).post(addPost);
router.route('/:postId').get(getPost).put(updatePost).delete(deletePost);
router.route('/:postId/likes').put(likePost);

module.exports = router;
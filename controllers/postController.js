
// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = (req, res) => {
  res.status(200).json({ message: 'Some arbitrary message' })
};

// @desc    Get single post
// @route   GET /api/posts/:postId
// @access  Private
const getPost = (req, res) => {
  res.status(200).json({ post: 'Post data' })
};

// @desc    Add new post
// @route   POST /api/posts
// @access  Private
const addPost = (req, res) => {
  res.status(200).json({ post: 'Post data' })
};

// @desc    Update single post
// @route   PUT /api/posts/:postId
// @access  Private
const updatePost = (req, res) => {
  res.status(200).json({ post: 'Post data' })
};

// @desc    Like a single post (i.e. add new user to likes array)
// @route   PUT /api/posts/:postId/likes
// @access  Private
const likePost = (req, res) => {
  res.status(200).json({ post: 'Post data' })
};

// @desc    Delete single post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = (req, res) => {
  res.status(200).json({ post: 'Post data' })
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  likePost,
  deletePost,
}
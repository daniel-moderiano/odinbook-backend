const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Comment model describes user-submitted comments associated with specific posts. Comments should display the user who posted the comment, the date/time posted, and should allow likes
const commentSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, // Reference to the User who created the comment
      ref: 'User', 
      required: true  
    },
    text: { type: String, required: true }, 
    likes: { type: Number, required: true }, 
    post: { 
      type: Schema.Types.ObjectId, // Reference which post the comment is attached to
      ref: 'Post', 
      required: true  
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  } 
);

module.exports = mongoose.model('Comment', commentSchema);
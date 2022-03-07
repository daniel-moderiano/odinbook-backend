const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for odinbook/facebook 'post'. Will include likes and comments, and likes should be linked to the user who liked the post. Supports img urls. 
const postSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, // Reference to the User who created the post
      ref: 'User', 
      required: true  
    },
    text: { type: String, required: true }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ],
    // Images to be managed by Cloudinary. ImageUrl provides a link to the image to display on frontend, imageId is the cloudinary ID that can be used to reference images for deletion
    image: { 
      imageId: String,
      imageUrl: String,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  } 
);

// TODO Virtual for number of likes
// TODO Virtual for number of comments
// TODO Virtual for timestamp

module.exports = mongoose.model('Post', postSchema);
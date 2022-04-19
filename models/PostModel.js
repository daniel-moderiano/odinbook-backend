const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

// Schema for odinbook/facebook 'post'. Will include likes and comments, and likes should be linked to the user who liked the post. Supports img urls. 
const postSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, // Reference to the User who created the post
      ref: 'User', 
      required: true  
    },
    text: String, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // It is understood that for a large scale app with thousands of potential comments, the better Schema design is having postID attached to individual comments, and no comments array in the post. Because this is a small scale app, the simpler solution is used here
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ],
    // Images to be managed by Cloudinary. ImageUrl provides a link to the image to display on frontend, imageId is the cloudinary ID that can be used to reference images for deletion
    image: { 
      imageId: String,
      imageUrl: String,
      altText: String,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    toJSON: { virtuals: true },   // Ensures res.json() provides the virtuals when this model is populated
    toObject: { virtuals: true },
  } 
);


// Return the total number of likes on a post
postSchema.virtual('numLikes').get(function() {
  return this.likes.length;
});

// Return the total number of comments on a post
postSchema.virtual('numComments').get(function() {
  return this.comments.length;
});

// Returns date posted in the form 'March 15, 2022'
postSchema.virtual('datePosted').get(function() {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_FULL);
});

module.exports = mongoose.model('Post', postSchema);
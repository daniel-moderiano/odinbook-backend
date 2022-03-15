const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

// Comment model describes user-submitted comments associated with specific posts. (though this connection is defined in the User model) Comments should display the user who posted the comment, the date/time posted, and should allow likes
const commentSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, // Reference to the User who created the comment
      ref: 'User', 
      required: true  
    },
    text: { type: String, required: true }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    toJSON: { virtuals: true },   // Ensures res.json() provides the virtuals when this model is populated
    toObject: { virtuals: true },
  } 
);

// Returns date posted in the form 'March 15, 2022'
commentSchema.virtual('dateAdded') .get(function() {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_FULL);
});

// Return the total number of likes on a comment
commentSchema.virtual('numLikes') .get(function() {
  return this.likes.length;
});


module.exports = mongoose.model('Comment', commentSchema);
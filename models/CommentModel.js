const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// TODO Virtual for number of likes
// TODO Virtual for timestamp (short date, e.g. 3 d, then hover for full timestamp year/time)

module.exports = mongoose.model('Comment', commentSchema);
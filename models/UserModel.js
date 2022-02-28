const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user. Requires  
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    friends: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['friend', 'incomingRequest', 'outgoingRequest'],
        } // All 'friends' will have an associated status marking them as current friend, incoming, or outgoing friend request
      }
    ],
    bio: {  // Basic information for profile page. All optional
      location: String,
      occupation: String,
      studiedAt: String,
      gender: String  // Almost considered enums for a second...
    }
    // TODO profile picture support
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// TODO Virtual for 'date joined' using timestamp? Or may need a specific date joined field for virtuals
// TODO virtual full name

module.exports = mongoose.model('User', userSchema);
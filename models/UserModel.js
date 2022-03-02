const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user. Requires  
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
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
      education: String,
      gender: String  // Almost considered enums for a second...
    },
    // TODO profile picture support - look at Multer + Mongo + Cloudinary setup
    profilePic: { type: String }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// TODO Virtual for 'date joined' using timestamp?
// Virtual for user's full name
userSchema  
  .virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })

module.exports = mongoose.model('User', userSchema);
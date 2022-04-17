const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // serves as a username
    password: String,   // not explicitly required as this would cause problems in the case of Facebook-linked accounts
    friends: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['friend', 'incomingRequest', 'outgoingRequest', 'deletedRequest'],
        } // All 'friends' will have an associated status marking them as current friend, incoming, or outgoing friend request
      }
    ],
    bio: {  // Basic information for profile page. All optional
      location: String,
      occupation: String,
      education: String,
      gender: String
    },
    // Images to be managed by Cloudinary. ImageUrl provides a link to the image to display on frontend, imageId is the cloudinary ID that can be used to reference images for deletion
    profilePic: { 
      imageId: String,
      imageUrl: String,
    },
    facebookId: String,   // set to the profileID provided by facebook when the user authenticates via FB. Used for FB account lookup
  },
  
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    toJSON: { virtuals: true },   // Ensures res.json() provides the virtuals when this model is populated
    toObject: { virtuals: true },
  },
);

// Virtual for user's full name
userSchema  
  .virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })

  // Virtual to populate all the posts by the user 
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('numFriends').get(function() {
  // Do not attempt to return numFriends if the user does not have a friends array (this covers those cases where client requests user data that does not include friends in the projection). Because virtuals: true is set, this virtual will always try to call on every user request regardless of projections
  if (!this.friends) {
    return;
  }

  if (this.friends.length !== 0) {
    return this.friends.filter((friend) => friend.status === 'friend').length;
  } else {
    return 0;
  }
})

// Returns date joined in the form 'March 15, 2022'
userSchema.virtual('dateJoined').get(function() {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_FULL);
});

module.exports = mongoose.model('User', userSchema);
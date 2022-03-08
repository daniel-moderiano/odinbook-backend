const cloudinary = require("cloudinary").v2;
const config = require('./cloudinary');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'odinbook',
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
      // File type is accepted; upload the file, passing null as the error param
      cb(null, true);
    } else {  // format not supported. Deny the upload with custom error
      cb(new Error('File format not supported. Please upload png/jpeg/gif only.'), false);
    }
  },
});

module.exports = upload;
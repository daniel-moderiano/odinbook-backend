const cloudinary = require("cloudinary").v2;
const config = require('./cloudinary');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype !== 'image/png') {  // file is not PNG format
      cb(new Error('File format not allowed'), false)
    }
     // File type is accepted; upload the file, passing null as the error param
    cb(null, true);
  },
});

module.exports = upload;
const mongoose = require("mongoose");

// Define func for connecting to mongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://daniel:daniel12@cluster0.1ukut.mongodb.net/odinbook?retryWrites=true&w=majority');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

module.exports = connectDB;
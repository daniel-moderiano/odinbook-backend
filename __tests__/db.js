const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function initialiseMongoServer() {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on("error", e => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });
}

async function stopMongoServer () {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

async function clearMongoServer () {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

exports.db = {
  initialiseMongoServer,
  stopMongoServer,
  clearMongoServer
};
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const app = require("../../../vehicle-booking-system/src/App");


let mongo;
let request;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  request = supertest(app);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (let key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

module.exports = () => request;

const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
const database = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = database;

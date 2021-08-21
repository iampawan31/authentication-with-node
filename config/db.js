const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connection Succeeded.");
  } catch (error) {
    console.log("Error in DB connection: " + error);
  }
};

module.exports = connectDB;

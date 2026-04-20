//db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Menna:T-J2gJB%25xRDqSHQ@cluster0.vnuyztt.mongodb.net/?appName=Cluster0");
    console.log("DB connected ✅");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require("mongoose");
const { seedDatabase } = require("../seeding");

mongoose.connect(process.env.mongo_url);

const db = mongoose.connection;
db.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

db.on("error", () => {
   console.log("Mongo Db Connection Failed");
});


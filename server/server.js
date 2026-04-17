const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");
const { seedDatabase } = require("./seeding");



app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));
app.use("/api/bus-stands", require("./routes/busStandsRoutes"));

app.use("/api/config", require("./routes/googleMapRoutes"));

// listen to port
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    console.log("Starting database seeding...");
    await seedDatabase();
    console.log("Database seeding completed or skipped");
  } catch (err) {
    console.error("Error during database seeding:", err);
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
})
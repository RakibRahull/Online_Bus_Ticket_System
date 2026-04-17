const BusStand = require("../models/busStandModel");

// Get all bus stands
const GetAllBusStands = async (req, res) => {
  try {
    const busStands = await BusStand.find();
    res.status(200).send({
      message: "Bus stands fetched successfully",
      success: true,
      data: busStands
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching bus stands",
      success: false,
      error: error.message
    });
  }
};

// Get bus stands by city
const GetBusStandsByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const busStands = await BusStand.find({ city: cityName });
    res.status(200).send({
      message: "Bus stands fetched successfully",
      success: true,
      data: busStands
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching bus stands",
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  GetAllBusStands,
  GetBusStandsByCity
};
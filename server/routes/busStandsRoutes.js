const express = require("express");
const router = express.Router();
const { GetAllBusStands, GetBusStandsByCity } = require("../Controllers/busStandsController");

router.get("/get-all-stands", GetAllBusStands);
router.get("/city/:cityName", GetBusStandsByCity);

module.exports = router;

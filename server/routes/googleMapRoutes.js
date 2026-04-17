const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/map-api-key", authMiddleware, (req, res) => {
  // Only provide the key to authenticated users
  res.status(200).send({
    success: true,
    data: {
      googleMapsApiKey: process.env.google_api_key
    }
  });
});
// This is less secure but may be needed for your map on public pages
router.get("/public-map-key", (req, res) => {
    res.status(200).send({
      success: true,
      data: {
        googleMapsApiKey: process.env.google_api_key
      }
    });
  });
  
module.exports = router;
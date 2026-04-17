const mongoose = require("mongoose");

const busStandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String, 
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  routes: {
    type: [String],
    default: []
  },
  contactNumber: {
    type: String,
    default: ""
  },
  facilities: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("bus-stands", busStandSchema);
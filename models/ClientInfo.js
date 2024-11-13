const mongoose = require("mongoose");

const clientInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("ClientInfo", clientInfoSchema);

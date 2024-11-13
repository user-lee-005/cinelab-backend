const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer, // Buffer is used to store binary data, such as images
    required: false,
  },
});

module.exports = mongoose.model("TeamMember", teamMemberSchema);

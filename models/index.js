const mongoose = require("mongoose");
const config = require("../config/config.json");
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const db = {};

// MongoDB Atlas URI
const mongoURI = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/?retryWrites=true&w=majority&appName=${dbConfig.database}`;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Models
db.TeamMember = require("./TeamMember");
db.ClientInfo = require("./ClientInfo");

module.exports = db;

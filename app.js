const express = require("express");
const bodyParser = require("body-parser");
const teamMembersRoutes = require("./routes/teamMembers");
const corsConfig = require("./config/corsConfig");

const app = express();
const port = 3001;

// Enable CORS
app.use(corsConfig); // You can use your existing corsConfig or configure here

// Body Parser middleware for JSON data
app.use(bodyParser.json());

// API routes for team members
app.use("/api", teamMembersRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

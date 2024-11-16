const express = require("express");
const teamMembersRoutes = require("./routes/teamMembers");
const corsConfig = require("./config/corsConfig");
const compression = require("compression");

const app = express();
const port = 3001;

// Enable CORS
app.use(corsConfig); // You can use your existing corsConfig or configure here

app.use(compression());

// Body Parser middleware for JSON data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// API routes for team members
app.use("/api", teamMembersRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const donorRoutes = require("./routes/donorRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/donors", donorRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const todosRouter = require("./routes/todos");

const app = express();

const cors = require("cors");

// Middleware
app.use(
  cors({
    origin: "*",
    credentials:true,         
    optionSuccessStatus:200
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Routes
app.use("/api/todos", todosRouter);
``
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

const PORT = process.env.PORT || 8000;

const URI = process.env.DATABASE_URL;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Route
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connect to database");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// json web token


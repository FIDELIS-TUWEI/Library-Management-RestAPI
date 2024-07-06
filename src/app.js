const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const indexRoutes = require("./routes/index");

const app = express();

app.use(express.json({ limit: "5mb" })); // parse req.body
app.use(express.urlencoded({ extended: true })); // parse form data(urlencoded)
app.use(cookieParser());

app.use(morgan("dev"));
app.use(cors());

app.disable("x-powered-by"); // disable express server fingerprinting

app.use("/api/v1", indexRoutes);


module.exports = app;
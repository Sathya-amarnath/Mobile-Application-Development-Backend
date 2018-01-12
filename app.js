const express = require("express");
//const path=require('path');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose= require('mongoose');

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const deityRoutes = require("./api/routes/deities");
const contactRoutes = require("./api/routes/contacts");

mongoose.connect('mongodb://127.0.0.1/templeapp');
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(morgan("dev"));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Set up a whitelist of domains that can render us in an iframe
var XFRAME_WHITELIST = [ 'https://www.youtube.com/'];
// If the domain matches, allow iframes from that domain
if (XFRAME_WHITELIST.indexOf(req.query.domain) !== -1) {
    res.header('X-FRAME-OPTIONS', 'ALLOW-FROM ' + req.query.domain);
}
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "*"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/deities", deityRoutes);
app.use("/contacts",contactRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
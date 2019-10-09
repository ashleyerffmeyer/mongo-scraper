// Required dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set up an Express Router
var router = express.Router();

// Make public a static folder
app.use(express.static("public"));

// Require our routes file pass our router object
require("./config/routes")(router);


// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise, use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(db, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Mongoose connection is successful!")
    }
});

// Have every request go through our router middle ware
app.use(router);

// Port to listen to 
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
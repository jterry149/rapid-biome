// Set up our dependencies for the project
var express = require("express");
var passport = require("passport");
var session = require('express-session');
var exphbs = require("express-handlebars");

// pull the datebase in from the route in models
var db = require("./models");

// Set variable to the reference express
var app = express();

// Middleware use for Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// For Passport 
// session secret
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true}));     
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session()); 

// Import the server file for server.js
var env = require("dotenv").load(); 

// Set the variable to reference the port and localhost port
var PORT = process.env.PORT || 3000;

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;

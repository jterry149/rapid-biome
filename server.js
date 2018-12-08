// Set up our dependencies for the project
var express = require("express");
var passport = require("passport");
var session = require('express-session');
var exphbs = require("express-handlebars");
var path = require('path');
var env = require("dotenv").load(); 

// Set the port and localhost port
var PORT = process.env.PORT || 3000;
// Set variable to the reference express
var app = express();

// Import the models folder
var db= require("./models");



// Middleware use for Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// For Passport 
// session secret
app.use(session({ secret: 'rHUyjs6RmVOD06OdOTsVAyUUCxVXaWci',resave: true, saveUninitialized:true}));     
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session()); 


// Handlebars
var viewsPath = path.join(__dirname, 'views');
var layoutPath = path.join(viewsPath, 'layouts');
var partialPath = path.join(viewsPath, 'partials');
app.set('views', 'viewPath');

var exphbsConfig = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: layoutPath,
    partialsDir: [partialPath],
    extname: '.handlebars'
});

app.engine('handlebars', exphbsConfig.engine);
app.set('view engine', '.handlebars');



// Routes
require("./routes/auth.js")(app, passport);
//require("./routes/apiRoutes.js")(app, passport);
//require(".routes/htmlRoutes.js")(app, passport);

// Passport strategies
require('./config/passport/passport')(passport, models.user);

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync({ force: true }).then(function() 
{
    app.listen(PORT, function(err) 
    {  
        console.log('App listening on PORT '+ PORT);
    });
})



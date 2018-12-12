// Set up our dependencies for the project
var express = require("express");
var passport = require("passport");
var session = require('express-session');
var exphbs = require("express-handlebars");
var path = require('path');
require('dotenv').load();
var nodemailer = require('nodemailer');

// Import the models folder
var db= require("./models");
require('dotenv').config();

// Set the port and localhost port
var PORT = process.env.PORT || 3000;

// Set variable to the reference express
var app = express();

// Middleware use for Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// For Passport 
// session secret
app.use(session({ 
    secret: 'rHUyjs6RmVOD06OdOTsVAyUUCxVXaWci',
    resave: true, 
    saveUninitialized:true}));     
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session()); 


// Handlebars
var viewsPath = path.join(__dirname, 'views');
var layoutPath = path.join(viewsPath, 'layouts');
var partialPath = path.join(viewsPath, 'partials');
app.set('views', viewsPath);

var exphbsConfig = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: layoutPath,
    partialsDir: [partialPath],
    extname: '.handlebars'
});

app.engine('handlebars', exphbsConfig.engine);
app.set('view engine', '.handlebars');



// Controller of routes
require('./controllers/authcontroller')(app, passport);
// Routes for pages
//require("./routes/apiRoutes.js")(app);
//require(".routes/htmlRoutes.js")(app);

// Passport strategies
require('./config/passport/passport')(passport,db.user);

// POST route from contact form
app.post('/contact', function (req, res) {
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    });
    mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;',
      to: GMAIL_USER,
      subject: 'New message from contact form at fasting companion',
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function (error, response) {
      if (error) {
        res.render('contact-failure');
      }
      else {
        res.render('contact-success');
      }
    });
  });
// Starting the server, syncing our models test ------------------------------------/
db.sequelize.sync({ force: true }).then(function() 
{
    app.listen(PORT, function(err) 
    {  
        console.log('App listening on PORT '+ PORT);
    });
})



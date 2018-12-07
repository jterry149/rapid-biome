// Grab the authcontroller.js
var authController = require('../controllers/authcontroller.js');

// Export the forms 
module.exports = function(app,passport)
{
    // Get the forms
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/logout',authController.logout);


    // Post for signup
    app.post('/signup', passport.authenticate('local-signup',  { successRedirect: '/dashboard',failureRedirect: '/signup'}));

    // Post for signin
    app.post('/signin', passport.authenticate('local-signin',  
    {   successRedirect: '/dashboard',
        failureRedirect: '/signin'
    }));

    // Function to protect the middleware route
    function isLoggedIn(req, res, next) 
    {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}






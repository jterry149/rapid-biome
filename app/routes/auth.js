// grab the authcontroller.js
var authController = require('../controllers/authcontroller.js');
 
// define the signup and sign in route
module.exports = function(app) 
{
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
}
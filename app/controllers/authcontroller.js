var exports = module.exports = {}

// export and render the signup sheet
exports.signup = function(req, res) 
{
 
    res.render('signup');
}

// Export and render the signin sheet
exports.signin = function(req, res) 
{
    res.render('signin');
}

// Export and render the dashboard message
exports.dashboard = function(req, res) 
{
 
    res.render('dashboard');
 
}

// Exports to logout of the application
exports.logout = function(req, res) 
{
 
    req.session.destroy(function(err) 
    {
 
        res.redirect('/');
 
    });
 
}
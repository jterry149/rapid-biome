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
module.exports = function(app, passport) 
{
    app.get('/', function(req, res)  {
      res.render('index');
    });
  
    app.get('/signup', function(req, res)  {
      res.render('signup');
    });
  
    app.get('/signin', function(req, res)  {
      res.render('signin');
    });
  
    app.post(
      '/signup',
      passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
      })
    );
  
    app.get('/dashboard', isLoggedIn, function(req, res)  {
      res.render('dashboard');
    });
  
    app.get('/logout', function(req, res) {
      req.session.destroy(err => {
        res.redirect('/');
      });
    });
  
    app.post('/signin',passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
        })
    );
  
    function isLoggedIn(req, res, next) 
    {
      if (req.isAuthenticated()) return next();
        res.redirect('/signin');
    }
};
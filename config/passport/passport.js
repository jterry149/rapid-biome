// Used to load BCrypt for secure passwords
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) 
{
    // Variables to bring in the user and LocalStrategy
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    // Serialize passport user
    passport.serializeUser(function(user, done) 
    {
        done(null, user.id);
    });


    // Deserialize the passport user
    passport.deserializeUser(function(id, done) 
    {
        User.findById(id).then(function(user) {
            if(user)
            {
                done(null, user.get());
            }
            else
            {
                done(user.errors,null);
            }
        });
    });


    // Passport local strategy for signup
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done)
        {
            // Hashed passwords function
            var generateHash = function(password) 
            {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            // Using Sequelize we check to see if user exists if not add them
            User.findOne({ where: { email: email}}).then(function(user)
            {
                if(user)
                {
                    return done(null, false, 
                        {
                        message: 'That email is already taken'
                    });
                }else
                {
                    var userPassword = generateHash(password);

                    var data =
                    {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };

                    User.create(data).then(function(newUser, created){
                        if(!newUser)
                        {
                            return done(null, false);
                        }

                        if(newUser)
                        {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    // Passport local strategy for signin
    passport.use('local-signin', new LocalStrategy(
    {
        // Local strategy uses username and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
    function(req, email, password, done) 
    {
        // Set variable to reference user
        var User = user;

        // Function isValidPassword compares password entered with bCrypt and the one stored on the database
        var isValidPassword = function(userpass, password) 
        {
            return bCrypt.compareSync(password, userpass);
        }
        User.findOne({
            where: 
            {
                email: email
            }
            }).then(function(user) 
            {
                if (!user) 
                {
                    return done(null, false, 
                    {
                        message: 'Email does not exist'
                    });
                }
     
                if (!isValidPassword(user.password, password)) 
                {
                    return done(null, false, 
                    {
                        message: 'Incorrect password.'
                    });
                }

                // Initialize userinfo to get the user infor
                var userinfo = user.get();
                
                // return the userinfo
                return done(null, userinfo);
     
     
            }).catch(function(err) 
            {
                console.log("Error:", err);
                return done(null, false, 
                {
                    message: 'Something went wrong with when signing in'
                });
            });
        }
    ));
}


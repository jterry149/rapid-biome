// Used to secure passwords
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) 
{
    // Variables to bring in the user and LocalStrategy
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done){

            // Hashed passwords function
            var generateHash = function(password) 
            {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            // Using Sequelize we check to see if user exists if not add them
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user){
                if(user)
                {
                    return done(null, false, {
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
}

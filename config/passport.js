const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// user Model
let  User = require('../models/User');
// passport middleware
module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            //user match
            User.findOne({ email: email })
            .then(user => {
                if(!user){
                    return done(null,false,{message: 'That email is not registered'});

                }
                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password incorrect'});
                    }
                })

            })
            .catch(err => console.log(err));
        })
        
        )
        passport.serializeUser((user, done) => {
            done(null, user.id);
        }
        );
        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        }
        );
        
}


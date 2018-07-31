module.exports = function(passport){
    //passport strategies
    
    //load all the things we need

    const LocalStrategy = require('passport-local').Strategy;

    //load the cripto module
    const crypto = require('crypto');

    //load the nodemailer to sen emails
    const nodemailer = require('nodemailer');

    // load the user schema from the models lo comunicate with the databse
    const User = require('../models/user');

    
    //used to serialized the user for the session
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    //used to desearilzed the user
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });


    //local signing strategies
passport.use('local-sign-in',new LocalStrategy({
        //by default localatretegie uses local username and password
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true//allows us to pass in the req form our route (let us check if user is logged in or not)

    },
function(req,email,password,done){
    if(email)
    email = email.toLowerCase();

    process.nextTick(function(){
        User.findOne({
            'email':email
        },function(err,user){
            //if there is any error,return the error
            if(err) return done(err);

            else if(!user){
                return done(null,false,req.flash('sign-in-msg','No user found.'));
            }

            else if (!user.isValidPassword(password)){
                return done(null, false, req.flash('sign-in-msg','Oops! Wrong pass'));
            }

            else if(!user.isEmailConfirmed()){
                return done(null, false, req.flash('sign-in-msg','your email has not been confirmed'));
            }

            else
                return done(null,user);
        });
    });
}));


passport.use('local-sign-up',new LocalStrategy({
    //by default localatretegie uses local username and password
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true//allows us to pass in the req form our route (let us check if user is logged in or not)

},
function(req,email,password,done){
    if(email)
    email = email.toLowerCase();

    process.nextTick(function(){
        if(!req.user){
            User.findOne({
                'email':email
            },
            function(err,user){
                if(err) return done(err);

                if(user){
                    return done(null,false,req.flash
                    ('sign-up-msg','That email is already taken'));
                }
            
        
                else if (password !== req.body.password_confirmation){
                    return done(null,false,req.flash('signupMessage','Password do not match'));
                }

                else{
                    //create an email token
                    let emailHash = crypto.randomBytes(20).toString("hex");
                    //create the user
                    let newUser = new User();
                    newUser.email = email;
                    newUser.password =newUser.generateHash(password);
                    newUser.name=req.body.name;
                    newUser.emailConfirmed = false;
                    newUser.emailConfirmationToken = emailHash;

                    newUser.save(function(err){
                        if(err){
                            return done(err);
                        }
                        
                        let smtpTransport = nodemailer.createTransport({
                            service:'gmail',
                            auth:{
                                user: 'fviclass@gmail.com',
                                pass:'fviclass2017'
                            }
                        });
                        
                        let mailOptions = {
                            to:email,
                            from:'Blog',
                            subject:'Hi '+ newUser.name + ', here is your email verification',
                            text:'Please click in link below to confirm your email or copy and paste in your browser url bar\n\n http://' + req.headers.host + '/email-confirmation/' + emailHash,html:
                            `
                            <p>
                                Please click in the link below</br>
                                <a href='http://${req.headers.host}/email-confirmation/${emailHash}'>
                                
                                    confirm your email address 
                                </a>
                            </p>`
                        };
                        console.log(mailOptions.html);

                        smtpTransport.sendMail(mailOptions);
                        // sets it to false to redirect the user to the login page
                        return done(null,newUser, req.flash('sign-in-msg','A verification email has been to' + email));
                    });
                }
            });
            // if the user is signed in but has no local account...
        }else{
            //user is signied in and already has a local account. Ignore sigup. (You log out before trying to create a new account, user)
            return done(null,req.user);
        }
    });
}));

// Local update strategy
passport.use('local-profile-update', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function (req, email, password, done) {
    if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    // asynchronous
    process.nextTick(function () {
      // if the user is not already logged in:
      if (!req.user) {
        return done(null, false, req.flash('update-profile-msg', 'You must be logged in to update your profile information'));
      }

      // if password is invalid, return message
      else if (!req.user.isValidPassword(password)) {
        return done(null, false, req.flash('update-profile-msg', 'Oops! Wrong password'));
      }

      else {
        var user = req.user;
        if (req.body.new_password && req.body.new_password_confirmation && req.body.new_password === req.body.new_password_confirmation) {
          user.password = user.generateHash(req.body.new_password);
        }

        user.name = req.body.name;
        user.birthday = req.body.birthday;

        user.save(function (err) {
          if (err)
            return done(err);

          return done(null, user, req.flash('update-profile-msg', 'Profile updated successfully!'));
        });
      }
    });
  }));
}


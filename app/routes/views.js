const format = require('../methods/format');

module.exports = function(app, isLoggedIn){
   

    app.get('/',function(req, res){
        if(req.isAuthenticated()){
            res.redirect('/home');
        }
        else{
            res.redirect('/sign-in');
        }
        
    });

    app.get('/home', isLoggedIn, function(req, res){
        console.log('do some');
        res.render('home.ejs',{
            user: req.user
        });
    });

    app.get('/password-recovery',function(req, res){
        res.render('password_recovery.ejs');
    });

    app.get('/password-reset',function(req, res){
        res.render('password_reset.ejs');
    });

    app.get('/profile',isLoggedIn,function(req, res){
        res.render('profile.ejs');
    });

    app.get('/sign-in',function(req, res){//sign-in is the name of the route
        res.render('signin.ejs',{message: req.flash('sign-in-msg')});
    });

    app.get('/sign-up',function(req, res){
        if (req.isAuthenticated()){
            res.redirect('/home');
        }
        else{
            res.render('signup.ejs',{
                message: req.flash('sign-up-msg')
            });
        }
        
    });

    app.get('/update-profile', isLoggedIn, function(req, res){
        res.render('update_profile.ejs',{
            message: req.flash('update-profile-msg'),
            user: req.user
        });
    });

    app.get('*',function(req, res){
        res.render('404.ejs');
    });

}
module.exports = function(app,passport){
    //require the authentications routess
    require('./auth')(app,passport,isLoggedIn);//esta pasadon the midleware/route como un parametro
    //require the views routess
    require('./views')(app,isLoggedIn);

}

//route middleware to make sure a user is logged in
// function isLoggedIn(req,res,next){

//     if(req.isAuthenticated())
//     console.log('do somenthing');
//     return next();

//     res.redirect('/');
// }

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        console.log('do somenthing');
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect('/');
    }
}
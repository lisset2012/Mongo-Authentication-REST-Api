const port = process.env.PORT || 8899;
const express = require('express');

const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const database = require('./database')();


require('./app/passport')(passport);

//parse the request body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine','ejs');//set up ejs for templating

//purpose of this is to enable cross domain requests
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port);
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  //require passport
  app.set('trust proxy',1);//trust first proxy

  app.use(session({
      secret:'cookieinthebroswer',
      resave:false,
      saveUninitialized:true,
      cookie:{
        secure:false
      }
  }));

  app.use(flash());

  app.use(passport.initialize());
  //persisteb loggin session
  app.use(passport.session());


// expose our assets(CSS,js,images,etc)
app.use("/", express.static(__dirname + "/assets"));//__dirname is a node method? expose whatever is in the folder "/assets" in the directoy "/"

require('./app/routes')(app,passport);

app.listen(port, function(err){
    if(err)console.log('error',err);

    console.log("Server listening on port" + port);
});
const express = require('express');
const app = express();
//Database and port configurations
const config = require('./config/configuration');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


//Assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
//====Configuration===
mongoose.connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(response => console.log(`DB connected successfully on: ${config.mongoDB}`))
.catch(err => console.log(`DB connection error: ${err.message}`));

//=========Passport==========
require('./config/passport')(passport); //pass passport for configuration

//=======Log every req and res to console with morgan logger===
app.use(logger('dev'));

//read cookies(needed for auth)
app.use(cookieParser());

//Get info from HTML forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//========Session setup & passport(initialization)======
app.use(session({
    secret: 'efbokntyu09*&544$%^',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());

//flash messaging
app.use(flash());

//=====Templating Engine Setup========
app.set('view engine', 'ejs');



//=====Importing the Routes=====
const defaultRoutes = require('./routes/defaultRoutes');
app.use('/', defaultRoutes);



app.listen(config.port, ()=>{
    console.log(`server listening on port: ${config.port}`);
});

const express = require("express");
const expressLayouts=require('express-ejs-layouts');
const flash=require('connect-flash');
const session=require('express-session');
const mongoose=require('mongoose')
const passport=require('passport')
const app=express();


//passport config
require('./config/passport')(passport);

// db config
const db=require('./config/keys').MongoURI

//db connect
mongoose.connect(db,{useNewUrlParser:true})
.then(console.log('db connected'))
.catch(err=> console.log(err))
//ejs
app.use(expressLayouts);

app.set('view engine','ejs')

// Body Parser
app.use(express.urlencoded({extended:false}));
// Express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());
//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'))


const PORT=process.env.PORT || 4000
 
app.listen(PORT,console.log(`server is running on port 4000`))
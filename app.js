if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology:true
  })
.then(() => {
    console.log("Connection Open");
})
.catch(err => {
    console.log("Oh No! Error!!!");
    console.log(err);
})

const db = mongoose.connection;

const { urlencoded } = require('express');

const app = express();

app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname , 'public')));
app.use(mongoSanitize());
// app.use(helmet({contentSecurityPolicy: false}));

const secret = process.env.SECRET || 'bettersecret';

// const store = new MongoStore({
//     url: dbUrl,
//     secret, 
//     touchAfter: 24 * 60 * 60
// });

const sessionConfig = {
    name: 'session',
    secret , 
    resave: false,
    saveUninitialized: true , 
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 7*24*60*60*1000 ,
        maxAge: 7*24*60*60*1000
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req , res , next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/' , userRoutes);
app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews' , reviewRoutes);

app.get('/' , (req,res) => {
    res.render('home');
})



app.all('*' , (req , res , next) => {
    next(new ExpressError('Page Not Found' , 404));
})

app.use((err , req ,res,next) => {
    const { statusCode=500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error' , {err});
})

const port = process.env.PORT || 3000;
app.listen(port , () => {
    console.log(`Listening on port: ${port}`)
})


// ********** Importing Modules **********
require('dotenv').config();
const express = require('express');
const middleware = require('./utilities/middleware');
const mongoose = require('mongoose');
const User = require('./schema/userSchema');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// ********** Using Modules **********
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(flash());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/combinate',
  },
  async function(accessToken, refreshToken, profile, cb) {
    const { err, currentUser } = await User.findOrCreate(profile);
    return cb(err, currentUser);
}));

// ********** Database Connection **********
mongoose.connect('mongodb://localhost:27017/combinateDatabase').then(() => {
    console.log('Database Connection Successful');
}).catch((err) => {
    console.log(`Error setting up connection to database: ${err}`);
});

app.use((req, res, next) => {
    res.locals.userLoggedIn = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.errorRegisterUser = req.flash('error-register-user');
    res.locals.errorRegisterEmail = req.flash('error-register-email');
    next();
});

// ********** Routes **********

// Home Route
const homeRoute = require('./routes/homeRoute');
app.use('/', homeRoute);

// User Route
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// oAuth Route
const authRoute = require('./routes/authRoute');
app.use('/auth', authRoute);

// Dashboard Route
const overviewRoute = require('./routes/overviewRoute');
app.use('/overview', middleware.isLoggedIn, overviewRoute);

// toDo Route
const todoRoute = require('./routes/todoRoute');
app.use('/todo', middleware.isLoggedIn, todoRoute);

const usersApiRoute = require('./routes/api/users');
app.use('/api/users', usersApiRoute);

const tasksApiRoute = require('./routes/api/tasks');
app.use('/api/tasks', tasksApiRoute);

// Search Route
const searchRoute = require('./routes/searchRoute');
app.use('/users', middleware.isLoggedIn, searchRoute);

// Courses Route
// const coursesRoute = require('./routes/coursesRoute');
// app.use('/courses', coursesRoute);

// Chats Route
const chatsRoute = require('./routes/chatsRoute');
const { transformAuthInfo } = require('passport');
app.use('/chats', middleware.isLoggedIn, chatsRoute);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Articles Route
// const articlesRoute = require('./routes/articleRoute');
// app.use('/articles', articlesRoute);

// ********** Server listening on port: 30000 **********
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// const io = require('socket.io') (server);

// io.on('connection', socket => {
    
// });


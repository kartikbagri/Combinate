// ********** Importing Modules **********
const passport = require('passport');
const User = require('../schema/userSchema');

// ********** RenderLogin Function **********
const renderLogin = (req, res) => {
    res.render('loginPage');
}

// ********** LoginUser Function **********
const loginUser = async (req, res) => {
    try {
        res.redirect('/overview');
    } catch(err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/login');
    }
}

// ********** RenderRegister Function **********
const renderRegister = (req, res) => {
    const prevInputs = req.session.prevInputs;
    delete req.session.prevInputs;
    res.render('registerPage', prevInputs);
}

// ********** RegisterUser Function **********
const registerUser = async (req, res) => {
    try {
        const {name, email, profilePic, username, password} = req.body;
        const user = new User({name, email, profilePic, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                console.log(err);
                req.flash('success', 'Registered Succesfully');
                req.flash('error', err.message);
                res.redirect('/login');
            } else {
                passport.authenticate('local', {failureRedirect: '/login', failureFlash: true});
                req.flash('success', 'Registered Successfully! Welcome to Combinate');
                res.redirect('/overview');
            }
        });
    } catch (err) {
        if(err.name == 'UserExistsError') {
            req.flash('error-register-user', 'Username taken');
        } else {
            req.flash('error-register-email', 'Email already exists');
        }
        const prevInputs = {name, email, username} = req.body;
        req.session.prevInputs = prevInputs;
        res.redirect('/register');
    }
}

// ********** Exporting Module **********
module.exports.renderRegister = renderRegister;
module.exports.registerUser = registerUser;
module.exports.renderLogin = renderLogin;
module.exports.loginUser = loginUser;
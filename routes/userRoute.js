// ********** Importing Modules **********
const express = require('express');
const users = require('../controllers/users');
const passport = require('passport');

// ********** Using Modules **********
const router = express.Router();

// ********** GET, POST: Login Route **********
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

// ********** GET, POST: Register Route **********
router.route('/register')
    .get(users.renderRegister)
    .post(users.registerUser);

// ********* Exporting Modules **********
module.exports = router;
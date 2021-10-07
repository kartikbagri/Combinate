// ********** Importing Modules **********
const express = require('express');
const passport = require('passport');

// ********** Using Modules **********
const router = express.Router();

// ********** Google oAuth **********

// ********** GET: /auth/google **********
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ********** GET: /auth/google/combinate **********
router.get('/google/combinate',
    passport.authenticate('google', {failureRedirect: '/login', failureFlash: true}), (req, res) => {
    res.redirect('/overview');
});


// ********* Exporting Modules **********
module.exports = router;
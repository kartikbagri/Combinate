const express = require('express');

// ********** Using Modules **********
const router = express.Router();

router.get('/', (req, res) => {
    const payload = {title: 'Overview', userLoggedIn: req.user};
    res.render('overview', payload);
});

module.exports = router;
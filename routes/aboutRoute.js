const express = require('express');

// ********** Using Modules **********
const router = express.Router();

router.get('/', (req, res) => {
    res.render('about');
});

module.exports = router;
// ********** Importing Modules **********
const express = require('express');

// ********** Using Modules **********
const router = express.Router();

// ********** Landing Page Render **********
router.get('/', (req, res) => {
    res.render('homePage');
})

// ********* Exporting Modules **********
module.exports = router;
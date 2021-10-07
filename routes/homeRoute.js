// ********** Importing Modules **********
const express = require('express');

// ********** Using Modules **********
const router = express.Router();

// ********** Landing Page Render **********
router.get('/', (req, res) => {
    res.send('home');
})

// ********* Exporting Modules **********
module.exports = router;
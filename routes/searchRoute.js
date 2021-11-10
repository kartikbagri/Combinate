// ********** Importing Modules **********
const express = require('express');

// ********** Using Modules **********
const router = express.Router();

// ********** Users Page Render **********
router.get('/', (req, res) => {
    const payload = {title: "Users", userLoggedIn: req.user}
    res.render('usersPage', payload);
})

// ********* Exporting Modules **********
module.exports = router;
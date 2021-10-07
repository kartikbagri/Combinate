const express = require('express');

// ********** Using Modules **********
const router = express.Router();

router.get('/', (req, res) => {
    const payload = {title: 'To Do', userLoggedIn: req.user};
    res.render('todoPage', payload);
});

module.exports = router;
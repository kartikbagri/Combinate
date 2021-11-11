const express = require('express');

// ********** Using Modules **********
const router = express.Router();

router.get('/', (req, res) => {
    const payload = {title: 'Chats', userLoggedIn: req.user};
    res.render('chatPage', payload);
});

module.exports = router;
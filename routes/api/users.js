const express = require('express');
const User = require('../../schema/userSchema');

// ********** Using Modules **********
const router = express.Router();

router.patch('/codingSites/:id', async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, {codingSites: req.body.codingSites})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    res.sendStatus(200);
});

module.exports = router;
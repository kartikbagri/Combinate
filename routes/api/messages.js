const express = require('express');
const Chat = require('../../schema/chatSchema');
const Message = require('../../schema/messageSchema');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { sender, content, chatId } = req.body;
        let message = new Message({
            content: content,
            chat: chatId,
            sender: sender
        });
        message = await message.save().catch(err => res.status(400).send(err));
        message = await message.populate('sender').catch(err => res.status(400).send(err));
        await Chat.findByIdAndUpdate(chatId, {$push: {chatMessages: message._id}}).catch(err => res.status(400).send(err));
        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

});

module.exports = router;
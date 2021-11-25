const express = require('express');
const Chat = require('../../schema/chatSchema');
const Message = require('../../schema/messageSchema');
const User = require('../../schema/userSchema');

const router = express.Router();

router.get('/:id1/:id2', async (req, res) => {
    const {id1, id2} = req.params
    let chat = await Chat.findOne({
        chatMembers: {
            $all: [id1, id2]
        }
    })
    .populate('chatMessages')
    .populate('chatMembers')
    .populate({
        path: 'chatMessages',
        populate: {
            path: 'sender',
            model: 'User'
        }
    })
    .catch(err => 
        res.status(400).json(err)
    );
    if(!chat) {
        chat = new Chat({
            chatMembers: [id1, id2]
        });
        chat = await Chat.create({chatMembers: [id1, id2]})
        .catch(err => res.send(err));
        chat = await chat.populate('chatMembers')
        .catch(err => {
            res.send(err);
        })
    }
    res.json(chat);
})

module.exports = router;
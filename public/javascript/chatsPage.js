const socket = io();

const chatsList = document.getElementById('chatsList');
const chatContainer = document.getElementById('chatContainer');
const messageContainer = document.getElementById('messageContainer');
const currentChatName = document.getElementById('currentChatName');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const noMessageContainer = document.getElementById('noMessageContainer');
const messageContent = document.getElementById('messageContent');
const chatIcon = document.getElementById('chatIcon');

const renderChatsList = async () => {
    const followingUsers = await axios.get(`/api/users/${userLoggedIn._id}/following`);
    chatsList.innerHTML = '';
    followingUsers.data.forEach(followingUser => {
        chatsList.insertAdjacentHTML('beforeend', createChatListItem(followingUser));
    });
}

const createChatListItem = (followingUser) => {
    return `
    <div id="${followingUser._id}" class="user-info">
        <div class="pfp-container">
            <img class="pfp" src="${followingUser.profilePic || 'images/profilePic.jpeg'}" alt="">
        </div>
        <h2>${followingUser.name}</h2>
    </div>
    `
}

chatsList.addEventListener('click', async (e) => {
    if(e.target.closest('.user-info')) {
        const id = e.target.closest('.user-info').id;
        const chat = await axios.get(`/api/chats/${id}/${userLoggedIn._id}`);
        socket.emit('join-chat-room', chat.data._id);
        renderChat(chat.data);
        // messageContainer.insertAdjacentHTML('beforeend', id);
    }
});

const renderChat = (chat) => {
    const user = chat.chatMembers.find(user => user._id != userLoggedIn._id);
    if(chat.isGroupChat) {
        currentChatName.innerText = chat.name;
    } else {
        currentChatName.innerText = user.name;
    }
    chatIcon.classList.remove('hidden');
    chatIcon.setAttribute('src', user.profilePic);
    sendMessageBtn.dataset.chatId = chat._id;
    renderMessages(chat.chatMessages);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const renderMessages = (messages) => {
    messageContainer.innerHTML = '';
    if(messages.length == 0) {
        noMessageContainer.classList.remove('hidden');
    } else {
        let first = false;
        let last = false;
        for(let i = 0; i < messages.length; i++) {
            const message = messages[i];
            noMessageContainer.classList.add('hidden');
            if(i == 0 || message.sender._id != messages[i-1].sender._id) {
                first = true;
            } else {
                first = false;
            }
            if(i == messages.length-1 || message.sender._id != messages[i+1].sender._id) {
                last = true;
            } else {
                last = false;
            }
            messageContainer.insertAdjacentHTML('beforeend', createMessage(message, first, last));
        }
    }
}

sendMessageBtn.addEventListener('click', async () => {
    const messageText = messageContent.value;
    if(messageText.trim().length == 0) {
        return;
    }
    noMessageContainer.classList.add('hidden');
    const chatId = sendMessageBtn.dataset.chatId;
    const messageData = {
        content: messageText,
        chatId: chatId,
        sender: userLoggedIn._id
    }
    const message = await axios.post('/api/messages', messageData)
    .catch(err => {console.log(err)});
    socket.emit('message-received', {message, chatId});
    messageContent.value = '';
    let allMessages = document.querySelectorAll('.message-container');
    let prevSentList = document.querySelectorAll('.message-container-sent');
    messageContainer.insertAdjacentHTML('beforeend', createMessage(message.data, true, true));
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(prevSentList[prevSentList.length-1] == allMessages[allMessages.length-1]) {
        if(prevSentList[prevSentList.length-2] != allMessages[allMessages.length-2]) {
            allMessages = document.querySelectorAll('.message-container');
            prevSentList = document.querySelectorAll('.message-container-sent');
            prevSentList[prevSentList.length-2].querySelector('.message').classList.remove('first-last');
            prevSentList[prevSentList.length-2].querySelector('.message').classList.add('sent-first');
        }
        prevSentList = document.querySelectorAll('.message-container-sent');
        prevSentList[prevSentList.length-1].querySelector('.message').classList.add('sent-last');
        prevSentList[prevSentList.length-2].querySelector('.message').classList.remove('sent-last')
        prevSentList[prevSentList.length-2].querySelector('.message').classList.remove('first-last');
    }
})

messageContent.addEventListener('keyup', (e) => {
    if(e.key == 'Enter' && e.shiftKey == true) {
        return;
    }
    if(e.key == 'Enter') {
        sendMessageBtn.click();
    }
});

const createMessage = (message, first, last) => {
    let senderProfilePicHidden = '';
    if(!last) {
        senderProfilePicHidden = 'no-visible';
    }
    let senderProfilePic = '';
    let sentOrReceived = '';
    let firstOrLast = '';
    if(message.sender._id != userLoggedIn._id) {
        senderProfilePic = `<div class="pfp-container message-pfp ${senderProfilePicHidden}">
            <img class="pfp" src=${message.sender.profilePic} alt="">
        </div>`
        sentOrReceived = 'received';
        if(first && last) {
            firstOrLast = 'first-last';
        } else if(first) {
            firstOrLast = 'received-first';
        } else if(last) {
            firstOrLast = 'received-last';
        }
    } else {
        sentOrReceived = 'sent';
        if(first && last) {
            firstOrLast = 'first-last';
        } else if(first) {
            firstOrLast = 'sent-first';
        } else if(last) {
            firstOrLast = 'sent-last';
        }
    }
    return `
    <div class="message-container message-container-${sentOrReceived}">
        ${senderProfilePic}
        <p class="message message-text message-${sentOrReceived} ${firstOrLast}">${message.content}</p>
    </div>
    `;
}


socket.on('message-received', (message) => {
    let allMessages = document.querySelectorAll('.message-container');
    let prevReceivedList = document.querySelectorAll('.message-container-received');
    messageContainer.insertAdjacentHTML('beforeend', createMessage(message.data, true, true));
    if(prevReceivedList[prevReceivedList.length-1] == allMessages[allMessages.length-1]) {
        if(prevReceivedList[prevReceivedList.length-2] != allMessages[allMessages.length-2]) {
            allMessages = document.querySelectorAll('.message-container');
            prevReceivedList = document.querySelectorAll('.message-container-received');
            prevReceivedList[prevReceivedList.length-2].querySelector('.message').classList.remove('first-last');
            prevReceivedList[prevReceivedList.length-2].querySelector('.message').classList.add('received-first');
        }
        prevReceivedList = document.querySelectorAll('.message-container-received');
        prevReceivedList[prevReceivedList.length-2].querySelector('.pfp').classList.add('no-visible');
        prevReceivedList[prevReceivedList.length-1].querySelector('.message').classList.add('received-last');
        prevReceivedList[prevReceivedList.length-1].querySelector('.message').classList.remove('first-last');
        prevReceivedList[prevReceivedList.length-2].querySelector('.message').classList.remove('first-last');
        prevReceivedList[prevReceivedList.length-2].querySelector('.message').classList.remove('received-last')
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

renderChatsList();
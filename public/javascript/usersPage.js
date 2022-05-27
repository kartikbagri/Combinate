const usersContainer = document.getElementById('usersContainer');

usersContainer.addEventListener('click', (e) => {
    if(e.target.closest('.follow-btn')) {
        e.preventDefault();
    }
});

const renderUsers = async () => {
    const users = await axios.get('/api/users/all');
    usersContainer.innerHTML = '';
    users.data.forEach(user => {
        if(user._id != userLoggedIn._id) {
            usersContainer.insertAdjacentHTML('beforeend', createUserCard(user));
        }
    });
}

usersContainer.addEventListener('click', (e) => {
    if(e.target.closest('.follow-btn')) {
        const id = e.target.id;
        const isFollowing = e.target.classList.contains('following');
        axios.patch(`/api/users/follow`, {userId: userLoggedIn._id, targetUserId: id, isFollowing: isFollowing})
        .then(() => {
            if(isFollowing) {
                e.target.innerText = 'Follow';
            } else {
                e.target.innerText = 'Following';
            }
            e.target.classList.toggle('following');
        })
        .catch(err => console.log(err));
    }
});

renderUsers();
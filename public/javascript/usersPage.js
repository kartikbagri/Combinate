const usersContainer = document.getElementById('usersContainer');

const renderUsers = async () => {
    const users = await axios.get('/api/users/all');
    usersContainer.innerHTML = '';
    users.data.forEach(user => {
        if(user._id != userLoggedIn._id) {
            usersContainer.insertAdjacentHTML('beforeend', createUserCard(user));
        }
    });
}

renderUsers();
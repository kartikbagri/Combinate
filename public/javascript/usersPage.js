const usersContainer = document.getElementById('usersContainer');

const renderUsers = async () => {
    const users = await axios.get('/api/users/all');
    usersContainer.innerHTML = '';
    users.data.forEach(user => {
        
    })
}
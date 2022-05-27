const userContainerIcon = document.getElementById('userContainerIcon');
const managerPopup = document.getElementById('managerPopup');
const search = document.getElementById('search');
const searchResults = document.getElementById('searchResults');

searchResults.addEventListener('click', (e) => {
    if(e.target.closest('.follow-btn')) {
        e.preventDefault();
    }
});

userContainerIcon.addEventListener('click', () => {
    managerPopup.classList.toggle('active-popup');
});

searchResults.addEventListener('click', (e) => {
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

const createUserCard = (user) => {
    let followButtonHTML = '';
    if(userLoggedIn.following.includes(user._id)) {
        followButtonHTML = `<button id="${user._id}" class="follow-btn following">Following</button>`;
    } else {
        followButtonHTML = `<button id="${user._id}" class="follow-btn">Follow</button>`;
    }
    return  `
    <a href="/userProfile/${user._id}" class="user-card">
            <div class="user-img-container">
                <img class="dp" src="${user.profilePic ? user.profilePic : 'images/profilePic.jpeg'}" alt="user-img">
            </div>
        <h3 class="user-name">
            ${user.name}
        </h3>
        <div class="user-card__info">
            <div class="interests-container">
                <div class="interest">
                    <h3>Interests : ${user.interests.join(", ")}</h3>
                </div>
            </div>
        </div>
            ${followButtonHTML}
    </a>
    `
}

search.addEventListener('keyup', async (e) => {
    const searchValue = search.value;
    if(searchValue == '') {
        searchResults.classList.add('hidden');
    } else {
        searchResults.classList.remove('hidden');
        const users = await axios.get(`/api/users/search?q=${searchValue}`);
        searchResults.innerHTML = '';
        users.data.forEach(user => {
            if(user._id != userLoggedIn._id) {
                searchResults.insertAdjacentHTML('beforeend', createUserCard(user));
            }
        });
    }
});
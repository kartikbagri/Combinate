// Contests Section
const addCodingSite = document.getElementById('addCodingSite');
const closeAddCodingSiteModal = document.getElementById('addCodingSiteCloseModal');
const codingSitesList = document.getElementById('codingSitesList');
const currCodingSites = userLoggedIn.codingSites;
const newCodingSites = [...currCodingSites];
const addCodingSiteSubmitButton = document.getElementById('addCodingSiteSubmitButton');

const updateCodingSites = () => {
    currCodingSites.forEach(site => {
        document.getElementById(site).classList.add('active-site');
        
    });
}

addCodingSite.addEventListener('click', (event) => {
    openModal('addCodingSite');
});

document.querySelector('.backdrop').addEventListener('click', function() {
    closeModal('addCodingSite');
})

closeAddCodingSiteModal.addEventListener('click', () => {
    closeModal('addCodingSite');
})

codingSitesList.addEventListener('click', (event) => {
    if(event.target.closest('.coding-site')) {
        const index = newCodingSites.indexOf(event.target.closest('.coding-site').id);
        if(index != -1) {
            event.target.closest('.coding-site').classList.remove('active-site');
            newCodingSites.splice(index, 1);
        } else {
            event.target.closest('.coding-site').classList.add('active-site');
            newCodingSites.push(event.target.closest('.coding-site').id);
        }
    }
})

addCodingSiteSubmitButton.addEventListener('click', async () => {
    const data = {
        codingSites: newCodingSites
    }
    await axios.patch(`/api/users/codingSites/${userLoggedIn._id}`, data)
    .catch(err => console.log(err));
    window.location.href = '/overview';
})

const openModal = (modalName) => {
    document.querySelector('.backdrop').classList.add('modal-show');
    document.getElementById(`${modalName}Modal`).classList.add('modal-show');
}

const closeModal = (modalName) => {
    document.getElementById(`${modalName}Modal`).classList.add('slide-up');
    setTimeout(function() {
        document.querySelector('.backdrop').classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('slide-up');
    }, 150);
}

const contestContainer = document.getElementById('contestsContainer');

const addContestCard = (HTMLText) => {
    contestContainer.insertAdjacentHTML('beforeend', HTMLText);
}

const createContestCard = (contest) => {
    const contestDate = new Date(contest.start_time);
    const HTMLText = `
    <div class="contest-item">
    <div class="contest-item__time">
    <h2 class="contest-item__date">
    ${contestDate.getDate()}
    </h2>
    <h3 class="contest-item__month">
    ${contestDate.toLocaleString('default', { month: 'long' })} ${contestDate.getFullYear()}
    </h3>
    </div>
    <a href="${contest.url}" target="_blank">
    <h3 class="contest-item__name">
    ${contest.name}
    </h3>
    </a>
    </div>
    `
    return HTMLText;
}


new Calendar({
    id: "#color-calendar"
});

var bar = new ldBar(".chart", {
    "stroke": 'rgba(114, 9, 183)',
    "stroke-width": 8,
    "preset": "circle",
    "value": 65
});

updateCodingSites();

if(contests.length == 0) {
    // const HTMLText = 'Upcoming contests for various websites are shown here. Tap + icon to select sites of your choice';
    // document.getElementsByClassName('schedule-section')[0].insertAdjacentHTML('afterbegin', HTMLText);
} else {
    contests.forEach(contest => {
        const HTMLText = createContestCard(contest);
        addContestCard(HTMLText);
    });
}
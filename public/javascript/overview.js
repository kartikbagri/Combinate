// Contests Section
const categories = userLoggedIn.categories;
const dailyGoals = document.getElementById('dailyGoals');
let dailyTasks = [];
const dailyTasksTab = document.getElementById('dailyTasksTab');
const addCodingSite = document.getElementById('addCodingSite');
const closeAddCodingSiteModal = document.getElementById('addCodingSiteCloseModal');
const codingSitesList = document.getElementById('codingSitesList');
const currCodingSites = userLoggedIn.codingSites;
const newCodingSites = [...currCodingSites];
const addCodingSiteSubmitButton = document.getElementById('addCodingSiteSubmitButton');
const goalSection = document.getElementById('goalSection');
const updateDailyTasksBtn = document.getElementById('updateDailyTasksBtn');

dailyTasksTab.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab') && !e.target.classList.contains('plus-tab')) {
        const prevCategory = dailyTasksTab.querySelector('.active-tab').innerText;
        dailyTasksTab.querySelector('.active-tab').classList.remove('active-tab');
        e.target.classList.add('active-tab');
        document.getElementById(prevCategory).classList.add('hidden');
        document.getElementById(e.target.innerText).classList.remove('hidden');
    }
});

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('check-goal')) {
        const taskId = e.target.id;
        if(e.target.checked) {
            dailyTasks.push(taskId);
        } else {
            dailyTasks.splice(dailyTasks.indexOf(taskId), 1);
        }
        console.log(dailyTasks);
    }
});

updateDailyTasksBtn.addEventListener('click', async () => {
    await axios.patch(`/api/tasks/completetasks/many`, {tasks: dailyTasks})
    .catch(err => console.log(err));
    location.reload();
})

const updateCodingSites = () => {
    currCodingSites.forEach(site => {
        document.getElementById(site).classList.add('active-site');
    });
}

const renderTab = (category) => {
    dailyTasksTab.insertAdjacentHTML('afterbegin', `<li class="tab">${category}</li>`);
        dailyGoals.insertAdjacentHTML('beforeend', `
        <ul class="hidden daily-goals-list" id=${category}></ul>
    `);
}

const renderTasks = async () => {
    const result = await axios.get(`/api/tasks/${userLoggedIn._id}`);
    const res = result.data;
    const tasks = res.filter(task => {
        return task.isCompleted === false;
    });
    const dailyTasks = tasks.filter(task => (task.startTime <= new Date().toISOString() && task.endTime >= new Date().toISOString()))
    dailyTasks.forEach(task => {
        if(!document.getElementById(task.category)) {
            renderTab(task.category);
        }
        console.log(task.category);
        document.getElementById(task.category).insertAdjacentHTML('beforeend', `
        <li class="daily-goal-item"><input id="${task._id}" class="check-goal" type="checkbox">${task.title}</li>
        `);
    });
    if(!dailyTasksTab.children[0].classList.contains('plus-tab')) {
        dailyTasksTab.children[0].classList.add('active-tab');
        document.getElementById(dailyTasksTab.children[0].innerText).classList.remove('hidden');
    }
}

addCodingSite.addEventListener('click', () => {
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


const renderBar = async () => {
    const result = await axios.get(`/api/tasks/${userLoggedIn._id}`);
    const res = result.data;
    const dailyTasks = res.filter(task => (task.startTime <= new Date().toISOString() && task.endTime >= new Date().toISOString()))
    const tasks = dailyTasks.filter(task => {
        return task.isCompleted === true;
    });
    console.log(res);
    console.log(tasks);
    const value = tasks.length/dailyTasks.length;
    const bar = new ldBar(".chart", {
        "stroke": 'rgba(114, 9, 183)',
        "stroke-width": 8,
        "preset": "circle",
        "value": Math.round(value*100)
    });
}

new Calendar({
    id: "#color-calendar"
});

updateCodingSites();
renderTasks();
renderBar();

if(contests.length == 0) {
    // const HTMLText = 'Upcoming contests for various websites are shown here. Tap + icon to select sites of your choice';
    // document.getElementsByClassName('schedule-section')[0].insertAdjacentHTML('afterbegin', HTMLText);
} else {
    contests.forEach(contest => {
        const HTMLText = createContestCard(contest);
        addContestCard(HTMLText);
    });
}

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
const addCategoryTabBtn = document.getElementById('addCategoryTabBtn');
const newCategoryCloseModal = document.getElementById('newCategoryCloseModal');
const newCategorySubmitButton = document.getElementById('newCategorySubmitButton');

const newTaskBtn = document.getElementById('newTaskBtn');
const newTaskCloseModal = document.getElementById('newTaskCloseModal');
const newTaskSubmitButton = document.getElementById('newTaskSubmitButton');
const stepOneBtn = document.getElementById('stepOneBtn');
const stepTwoBtn = document.getElementById('stepTwoBtn');
const firstStep = document.getElementById('firstStep');
const secondStep = document.getElementById('secondStep');
const thirdStep = document.getElementById('thirdStep');
const stepbackOneBtn = document.getElementById('stepbackOneBtn');
const stepbackTwoBtn = document.getElementById('stepbackTwoBtn');
const radioLabelIndividual = document.getElementById('radioLabelIndividual');
const radioLabelCollaborative = document.getElementById('radioLabelCollaborative');
const radioIndividual = document.getElementById('radioIndividual');
const radioCollaborative = document.getElementById('radioCollaborative');
const collaborativeSection = document.getElementById('collaborativeSection');

let newTaskModalTranslate = 0;

stepOneBtn.addEventListener('click', () => {
    if(radioCollaborative.checked) {
        collaborativeSection.classList.remove('hidden');
    } else {
        collaborativeSection.classList.add('hidden');
    }
    modalStepsContainer.classList.remove('slide-right-1');
    modalStepsContainer.classList.add('slide-left-1');
    newTaskModalTranslate += 1;
});

stepbackOneBtn.addEventListener('click', () => {
    modalStepsContainer.classList.add('slide-right-1');
    modalStepsContainer.classList.remove('slide-left-1');
    modalStepsContainer.classList.remove('slide-right-2');
    newTaskModalTranslate -= 1;
});

stepbackTwoBtn.addEventListener('click', () => {
    modalStepsContainer.classList.add('slide-right-2');
    modalStepsContainer.classList.remove('slide-left-2');
    newTaskModalTranslate -= 1;
})

stepTwoBtn.addEventListener('click', () => {
    if(newTaskTitle.value !== '' && newTaskDescription.value !== '') {
        modalStepsContainer.classList.add('slide-left-2');
        modalStepsContainer.classList.remove('slide-right-2');
        modalStepsContainer.classList.remove('slide-left-1');
        modalStepsContainer.classList.remove('slide-right-1');
        newTaskModalTranslate += 1;
    } else {
        alert('Please fill in all fields');
    }
});

newTaskBtn.addEventListener('click', () => {
    modalStepsContainer.classList.remove(`slide-left-${newTaskModalTranslate}`);
    newTaskModalTranslate = 0;
    firstStep.classList.remove('hidden-section');
    secondStep.classList.add('hidden-section');
    thirdStep.classList.add('hidden-section');
    document.getElementById('newTaskTitle').value = "";
    document.getElementById('newTaskDescription').value = "";
    const startTimeString = `${cal.getSelectedDate().getFullYear()}-${("0" + (cal.getSelectedDate().getMonth()+1)).slice(-2)}-${cal.getSelectedDate().getDate()}T00:00:00`;
    const endTimeString = `${cal.getSelectedDate().getFullYear()}-${("0" + (cal.getSelectedDate().getMonth()+1)).slice(-2)}-${cal.getSelectedDate().getDate()}T12:00:00`;
    document.getElementById('newTaskStartTime').setAttribute('value', startTimeString);
    document.getElementById('newTaskEndTime').setAttribute('value', endTimeString);
    radioCollaborative.checked = false;
    radioIndividual.checked = true;
    radioLabelCollaborative.closest('.radio-container').classList.remove('radio-checked');
    radioLabelIndividual.closest('.radio-container').classList.add('radio-checked');
    openModal('newTask');
})

newTaskCloseModal.addEventListener('click', () => {
    closeModal('newTask');
})

newTaskSubmitButton.addEventListener('click', () => {
    const newTask = {
        title: document.getElementById('newTaskTitle').value,
        description: document.getElementById('newTaskDescription').value,
        startTime: document.getElementById('newTaskStartTime').value,
        endTime: document.getElementById('newTaskEndTime').value,
        createdBy: userLoggedIn._id,
        category: document.getElementById('newTaskCategory').value
    }
    if(newTask.startTime > newTask.endTime) {
        alert('Start time cannot be after end time');
    } else {
        addNewTask(newTask);
    }
});

const addNewTask = async (newTask) => {
    if (newTask !== null) {
        const resTask = await axios.post(`/api/tasks/task/new/${userLoggedIn._id}`, newTask)
        .catch(err => console.log(err));
        await axios.patch(`/api/tasks/task/new/${userLoggedIn._id}`, [resTask.data])
        .catch(err => console.log(err));
        location.reload();
    }
}


radioCollaborative.addEventListener('click', () => {
    radioCollaborative.closest('.radio-container').classList.add('radio-checked');
    radioIndividual.closest('.radio-container').classList.remove('radio-checked');
});
radioIndividual.addEventListener('click', () => {
    radioIndividual.closest('.radio-container').classList.add('radio-checked');
    radioCollaborative.closest('.radio-container').classList.remove('radio-checked');
});
radioLabelCollaborative.addEventListener('click', () => {
    radioLabelCollaborative.closest('.radio-container').classList.add('radio-checked');
    radioLabelIndividual.closest('.radio-container').classList.remove('radio-checked');
});
radioLabelCollaborative.addEventListener('click', () => {
    radioLabelCollaborative.closest('.radio-container').classList.add('radio-checked');
    radioLabelIndividual.closest('.radio-container').classList.remove('radio-checked');
});

document.querySelector('.backdrop').addEventListener('click', () => {
    closeModal('newCategory');
    closeModal('newTask');
})

addCategoryTabBtn.addEventListener('click', () => {
    openModal('newCategory');
})

newCategoryCloseModal.addEventListener('click', () => {
    closeModal('newCategory');
});

newCategorySubmitButton.addEventListener('click', () => {
    const newCategory = document.getElementById('newCategoryInput').value;
    addNewCategory(newCategory);
})

const addNewCategory = async (newCategory) => {
    if (newCategory !== null) {
        categories.push(newCategory);
        const res = await axios.patch(`/api/tasks/category/new/${userLoggedIn._id}`, categories)
        .catch(err => console.log(err));
        window.location.href = '/todo';
    }
}

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

const buildDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const renderTasks = async () => {
    const result = await axios.get(`/api/tasks/${userLoggedIn._id}`);
    const res = result.data;
    const tasks = res.filter(task => {
        return task.isCompleted === false;
    });
    const dailyTasks = tasks.filter(task => (new Date(task.startTime).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && new Date(task.endTime).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) || (new Date(task.endTime).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)));
    dailyTasks.forEach(task => {
        if(!document.getElementById(task.category)) {
            renderTab(task.category);
        }
        document.getElementById(task.category).insertAdjacentHTML('beforeend', `
        <li class="daily-goal-item"><input id="${task._id}" class="check-goal" type="checkbox">${task.title}<span class="task-duration">(${buildDate(task.startTime)} - ${buildDate(task.endTime)})</span></li>
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
    const dailyTasks = res.filter(task => new Date(task.startTime).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && new Date(task.endTime).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0));
    const tasks = dailyTasks.filter(task => {
        return task.isCompleted === true;
    });
    let value = tasks.length/dailyTasks.length;
    if(dailyTasks.length === 0) {
        value = 1;
    }
    const bar = new ldBar(".chart", {
        "stroke": 'rgba(114, 9, 183)',
        "stroke-width": 8,
        "preset": "circle",
        "value": Math.round(value*100)
    });
}

const cal = new Calendar({
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

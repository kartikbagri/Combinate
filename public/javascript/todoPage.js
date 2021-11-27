let categories = userLoggedIn.categories;
if(!categories) {
    categories = [];
}
let newTaskModalTranslate = 0;

const listContainer = document.getElementById('listContainer');
const newCategoryAddBtn = document.getElementById('newCategoryAddBtn');
const newCategoryCloseModal = document.getElementById('newCategoryCloseModal');
const newCategorySubmitButton = document.getElementById('newCategorySubmitButton');
const deleteCategorySubmitButton = document.getElementById('deleteCategorySubmitButton');
const completeTaskSubmitButton = document.getElementById('completeTaskSubmitButton');
const completeTaskCloseModal = document.getElementById('completeTaskCloseModal');
const deleteCategoryCloseModal = document.getElementById('deleteCategoryCloseModal');
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

// Event Listeners for Modal
newCategoryAddBtn.addEventListener('click', () => {
    openModal('newCategory');
});

document.querySelector('.backdrop').addEventListener('click', function() {
    closeModal('newCategory');
    closeModal('newTask');
    closeModal('deleteCategory');
    closeModal('completeTask');
});

newCategoryCloseModal.addEventListener('click', () => {
    closeModal('newCategory');
});

newTaskCloseModal.addEventListener('click', () => {
    closeModal('newTask');
})

completeTaskCloseModal.addEventListener('click', () => {
    closeModal('completeTask');
})

deleteCategoryCloseModal.addEventListener('click', () => {
    closeModal('deleteCategory');
})

newCategorySubmitButton.addEventListener('click', () => {
    const newCategory = document.getElementById('newCategoryInput').value;
    addNewCategory(newCategory);
})

newTaskSubmitButton.addEventListener('click', () => {
    const newTask = {
        title: document.getElementById('newTaskTitle').value,
        description: document.getElementById('newTaskDescription').value,
        startTime: document.getElementById('newTaskStartTime').value,
        endTime: document.getElementById('newTaskEndTime').value,
        createdBy: userLoggedIn._id,
        category: newTaskSubmitButton.dataset.category
    }
    if(newTask.startTime > newTask.endTime) {
        alert('Start time cannot be after end time');
    } else {
        addNewTask(newTask);
    }
})

deleteCategorySubmitButton.addEventListener('click', () => {
    const categoryToDelete = deleteCategorySubmitButton.dataset.category;
    deleteCategory(categoryToDelete);
});

completeTaskSubmitButton.addEventListener('click', () => {
    const taskToComplete = completeTaskSubmitButton.dataset.taskid;
    completeTask(taskToComplete);
});

// Modals
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

// Rendering Categories
const renderCategories = () => {
    categories.forEach(category => {
        listContainer.insertAdjacentHTML('beforeend', 
        `
        <div id="${category}" class="list">
        <span data-category="${category}" class="delete-category material-icons material-icons-outlined">delete_outline</span>
        <h3 class="lists-category">${category}</h3>
        <div class="task-card plus">
        <span class=" material-icons material-icons-outlined">add</span>
        </div>
        </div>
        `);
    });
}

const buildDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US');
}

// Rendering Tasks
const renderTasks = async () => {
    const res = await axios.get(`/api/tasks/${userLoggedIn._id}`);
    const tasks = res.data;
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].isCompleted === false) {
            let sideIcon = '';
            if(tasks[i].endTime < new Date().toISOString()) {
                sideIcon = `<span data-taskId="${tasks[i]._id}" data-taskTitle="${tasks[i].title}" class="task-missed-btn material-icons material-icons-outlined">priority_high</span>`
            } else {
                sideIcon = `<span data-taskId="${tasks[i]._id}" data-taskTitle="${tasks[i].title}" class="task-complete-btn material-icons material-icons-outlined">task_alt</span>`
            }
            document.getElementById(tasks[i].category).insertAdjacentHTML('beforeend',
            `
            <div class="task-card">
                ${sideIcon}
                <h4 class="task-heading"><span class="bullet">•</span>${tasks[i].title}</h4>
                <p class="task-description">${tasks[i].description}</p>
                <p class="task-time">${buildDate(tasks[i].startTime)} - ${buildDate(tasks[i].endTime)}</p>
                <div class="members-list"></div>
            </div>
            `);
        }
    }
};

// Deleting Category
const deleteCategory = async (category) => {
    await axios.delete(`/api/tasks/category/${category}`)
    .catch(err => console.log(err));
    closeModal('deleteCategory');
    location.reload();
}

const completeTask = async (taskId) => {
    await axios.patch(`/api/tasks/complete/${taskId}`)
    .catch(err => console.log(err));
    location.reload();
}

// Adding new Category

const addNewCategory = async (newCategory) => {
    if (newCategory !== null) {
        categories.push(newCategory);
        const res = await axios.patch(`/api/tasks/category/new/${userLoggedIn._id}`, categories)
        .catch(err => console.log(err));
        location.reload();
    }
}

// Adding new Task

const addNewTask = async (newTask) => {
    if (newTask !== null) {
        const resTask = await axios.post(`/api/tasks/task/new/${userLoggedIn._id}`, newTask)
        .catch(err => console.log(err));
        await axios.patch(`/api/tasks/task/new/${userLoggedIn._id}`, [resTask.data])
        .catch(err => console.log(err));
        location.reload();
    }
}

document.addEventListener('click', event => {
    if(event.target.classList.contains('task-complete-btn')) {
        const taskId = event.target.dataset.taskid;
        const taskTitle = event.target.dataset.tasktitle;
        const completeTaskModalTitle = document.getElementById('completeTaskModalTitle');
        completeTaskModalTitle.innerText = `Complete Task: ${taskTitle}`;
        completeTaskSubmitButton.dataset.taskid = taskId;
        openModal('completeTask');
    }
});

document.addEventListener('click', event => {
    if(event.target.classList.contains('delete-category')) {
        const category = event.target.dataset.category;
        const deleteCategoryModalTitle = document.getElementById('deleteCategoryModalTitle');
        deleteCategoryModalTitle.innerText = `Delete Category: ${category}`;
        deleteCategorySubmitButton.dataset.category = category;
        openModal('deleteCategory');
    }
});

document.addEventListener('click', event => {
    if (event.target.closest('.plus')) {
        modalStepsContainer.classList.remove(`slide-left-${newTaskModalTranslate}`);
        newTaskSubmitButton.dataset.category = event.target.closest('.plus').parentElement.id;
        newTaskModalTranslate = 0;
        firstStep.classList.remove('hidden-section');
        secondStep.classList.add('hidden-section');
        thirdStep.classList.add('hidden-section');
        document.getElementById('newTaskTitle').value = "",
        document.getElementById('newTaskDescription').value = "",
        document.getElementById('newTaskStartTime').value = "",
        document.getElementById('newTaskEndTime').value = "",
        radioCollaborative.checked = false;
        radioIndividual.checked = true;
        radioLabelCollaborative.closest('.radio-container').classList.remove('radio-checked');
        radioLabelIndividual.closest('.radio-container').classList.add('radio-checked');
        openModal('newTask');
    }
});

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

// Intializing the page

renderCategories();
renderTasks();
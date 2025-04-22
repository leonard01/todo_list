// Get DOM elements
const addTaskButton = document.getElementById('add-task-btn');
const taskNameInput = document.getElementById('task-name-input');
const taskDescInput = document.getElementById('task-desc-input');
const taskStatusInput = document.getElementById('task-status-input');
const taskCompleteByInput = document.getElementById('task-complete-by-input');
const todoList = document.getElementById('todo-list');
const noTasksMessage = document.createElement('p');  // Create a message element

// Function to get the current date and time
function getCurrentDate() {
    const date = new Date();
    return date.toLocaleString();  // Formats the date and time as a human-readable string
}

// Function to check if a task is overdue
function isOverdue(completeByDate) {
    if (!completeByDate) return false;  // If no completeByDate is set, it's not overdue
    const currentDate = new Date();
    const completeDate = new Date(completeByDate);
    return currentDate > completeDate;  // Returns true if the current date is after the completeBy date
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = document.querySelectorAll('li');

    taskItems.forEach((taskItem) => {
        const taskName = taskItem.querySelector('.task-name').textContent;
        const taskDesc = taskItem.querySelector('.task-desc').textContent;
        const taskStatus = taskItem.querySelector('.task-status').value;
        const taskCreatedDate = taskItem.querySelector('.task-created-date').textContent;
        const taskCompleteBy = taskItem.querySelector('.task-complete-by') ? taskItem.querySelector('.task-complete-by').textContent : null; // Get complete-by date
        tasks.push({ name: taskName, description: taskDesc, status: taskStatus, createdDate: taskCreatedDate, completeBy: taskCompleteBy });
    });

    // Save the tasks array to localStorage as a string
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('todoTasks'));

    // Clear the list before adding tasks
    todoList.innerHTML = '';

    if (savedTasks && Array.isArray(savedTasks) && savedTasks.length > 0) {
        savedTasks.forEach(task => {
            // Ensure the task has name, description, status, createdDate, and completeBy (if set)
            if (task.name && task.description && task.status && task.createdDate) {
                addTaskToList(task.name, task.description, task.status, task.createdDate, task.completeBy);
            }
        });
    } else {
        // Show "No tasks have been set" message
        noTasksMessage.textContent = "No tasks have been set.";
        todoList.appendChild(noTasksMessage);
    }
}

// Function to add task to the list
function addTaskToList(taskName, taskDesc, taskStatus, taskCreatedDate, taskCompleteBy) {
    const listItem = document.createElement('li');
    const overdueMessage = isOverdue(taskCompleteBy) ? '<p class="overdue-message">Overdue</p>' : '';  // Display "Overdue" if the task is past its due date

    listItem.innerHTML = `
        <div>
            <strong class="task-name">${taskName}</strong>
            <p class="task-desc">${taskDesc}</p>
        </div>
        <select class="task-status">
            <option value="Todo" ${taskStatus === 'Todo' ? 'selected' : ''}>Todo</option>
            <option value="In Progress" ${taskStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${taskStatus === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${taskStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <p class="task-created-date">Created on: ${taskCreatedDate}</p>
        ${taskCompleteBy ? `<p class="task-complete-by">Complete by: ${taskCompleteBy}</p>` : ''}
        ${overdueMessage}  <!-- Overdue message will be displayed here if the task is overdue -->
        <button class="delete-btn">Delete</button>
    `;

    // Add delete functionality
    const deleteButton = listItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        todoList.removeChild(listItem);
        saveTasksToLocalStorage();  // Update localStorage after deletion
        loadTasksFromLocalStorage();  // Re-load tasks to update UI (including the "no tasks" message)
    });

    // Add event listener for status change
    const statusDropdown = listItem.querySelector('.task-status');
    statusDropdown.addEventListener('change', () => {
        saveTasksToLocalStorage();  // Update localStorage when the status changes
    });

    // Append task to the list
    todoList.appendChild(listItem);

    // Remove the "No tasks have been set" message if tasks are added
    if (todoList.contains(noTasksMessage)) {
        todoList.removeChild(noTasksMessage);
    }
}

// Add task event
addTaskButton.addEventListener('click', () => {
    const taskName = taskNameInput.value.trim();
    const taskDesc = taskDescInput.value.trim();
    const taskStatus = taskStatusInput.value;
    const taskCompleteBy = taskCompleteByInput.value ? new Date(taskCompleteByInput.value).toLocaleString() : null;  // Get complete-by date if set
    const taskCreatedDate = getCurrentDate();  // Get the current date and time

    if (taskName !== '' && taskDesc !== '') {
        addTaskToList(taskName, taskDesc, taskStatus, taskCreatedDate, taskCompleteBy);
        saveTasksToLocalStorage();  // Update localStorage when a new task is added
        taskNameInput.value = '';  // Clear input field
        taskDescInput.value = '';  // Clear description field
        taskStatusInput.value = 'Todo';  // Reset status dropdown to 'Todo'
        taskCompleteByInput.value = '';  // Clear complete-by date field
    } else {
        alert('Please enter both task name and description!');
    }
});

// Optional: Allow pressing "Enter" to add a task
taskDescInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTaskButton.click();
    }
});

// Load tasks from localStorage when the page is loaded
window.onload = loadTasksFromLocalStorage;

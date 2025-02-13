let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createNewSection() {
    const sectionName = prompt('Enter section name:');
    if (sectionName) 
        {
        const newSection = 
        {
            id: Date.now(),
            name: sectionName,
            tasks: [],
            collapsed: false
        };
        todos.push(newSection);
        saveToLocalStorage();
        renderSections();
    }
}

function addTask(sectionId) 
{
    const taskText = prompt('Enter task:');
    if (taskText) 
        {
        const section = todos.find(s => s.id === sectionId);
        const newTask = 
        {
            id: Date.now(),
            text: taskText,
            completed: false,
            subtasks: []
        };
        section.tasks.push(newTask);
        saveToLocalStorage();
        renderSections();
    }
}

function addSubtask(taskId, sectionId) 
{
    const subtaskText = prompt('Enter subtask:');
    if (subtaskText) 
        {
        const section = todos.find(s => s.id === sectionId);
        const task = section.tasks.find(t => t.id === taskId);
        task.subtasks.push(
        {
            id: Date.now(),
            text: subtaskText,
            completed: false
        });
        saveToLocalStorage();
        renderSections();
    }
}

function toggleTask(taskId, sectionId) {
    const section = todos.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    
    // Move completed task to bottom
    section.tasks.sort((a, b) => a.completed - b.completed);
    
    saveToLocalStorage();
    renderSections();
}
function toggleSubtask(subtaskId, taskId, sectionId) {
    const section = todos.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(st => st.id === subtaskId);
    subtask.completed = !subtask.completed;
    saveToLocalStorage();
    renderSections();
}
function editTask(taskId, sectionId) 
{
    const section = todos.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    const newText = prompt('Edit task:', task.text);
    if (newText) {
        task.text = newText;
        saveToLocalStorage();
        renderSections();
    }
}

function deleteSection(sectionId) {
    todos = todos.filter(s => s.id !== sectionId);
    saveToLocalStorage();
    renderSections();
}

function deleteTask(taskId, sectionId) {
    const section = todos.find(s => s.id === sectionId);
    section.tasks = section.tasks.filter(t => t.id !== taskId);
    saveToLocalStorage();
    renderSections();
}

function deleteSubtask(subtaskId, taskId, sectionId) {
    const section = todos.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    saveToLocalStorage();
    renderSections();
}

function renderSections() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = '';
    
    todos.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        const header = document.createElement('div');
        header.innerHTML = `
            <h3>${section.name}</h3>
            <button onclick="addTask(${section.id})">+ Add Task</button>
            <button class="delete-btn" onclick="deleteSection(${section.id})">Delete Section</button>
        `;
        
        const tasksDiv = document.createElement('div');
        section.tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
            
            taskDiv.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id}, ${section.id})">
                <span>${task.text}</span>
                <button onclick="editTask(${task.id}, ${section.id})">Edit</button>
                <button onclick="addSubtask(${task.id}, ${section.id})">+ Subtask</button>
                <button class="delete-btn" onclick="deleteTask(${task.id}, ${section.id})">Delete</button>
            `;
            
            // Render subtasks
            if (task.subtasks.length > 0) {
                const subtasksDiv = document.createElement('div');
                task.subtasks.forEach(subtask => {
                    const subtaskDiv = document.createElement('div');
                    subtaskDiv.className = `subtask ${subtask.completed ? 'completed-subtask' : ''}`;
                    subtaskDiv.innerHTML = `
                        <input type="checkbox" ${subtask.completed ? 'checked' : ''}
                            onchange="toggleSubtask(${subtask.id}, ${task.id}, ${section.id})">
                        <span>${subtask.text}</span>
                        <button class="delete-btn" onclick="deleteSubtask(${subtask.id}, ${task.id}, ${section.id})">Delete</button>
                    `;
                    subtasksDiv.appendChild(subtaskDiv);
                });
                taskDiv.appendChild(subtasksDiv);
            }
            
            tasksDiv.appendChild(taskDiv);
        });
        
        sectionDiv.appendChild(header);
        sectionDiv.appendChild(tasksDiv);
        container.appendChild(sectionDiv);
    });
}
// Initial render
renderSections();
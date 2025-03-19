document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.querySelector(".add-btn");
    const deleteAllButton = document.querySelector(".delete-all-btn");
    const taskList = document.getElementById("taskList");

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(taskText => addTask(taskText, false));
    }

    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll(".task span"))
                          .map(task => task.textContent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask(taskText = "", save = true) {
        taskText = taskText.trim() || taskInput.value.trim();
        if (taskText === "") return;

        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div class="icons">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        taskList.appendChild(li);
        taskInput.value = "";

        if (save) saveTasks();
    }

    function deleteAllTasks() {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
    }

    function handleTaskActions(event) {
        const target = event.target;
        const taskItem = target.closest(".task");
        
        if (target.classList.contains("delete-btn")) {
            taskItem.remove();
            saveTasks();
        } else if (target.classList.contains("edit-btn")) {
            editTask(taskItem);
        }
    }

    function editTask(taskItem) {
        const taskTextElement = taskItem.querySelector(".task-text");
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskTextElement.textContent;
        input.classList.add("task-edit-input");
        
        input.addEventListener("blur", () => saveEditedTask(taskItem, input));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                saveEditedTask(taskItem, input);
            }
        });

        taskTextElement.replaceWith(input);
        input.focus();
    }

    function saveEditedTask(taskItem, input) {
        const newText = input.value.trim();
        if (newText !== "") {
            const span = document.createElement("span");
            span.classList.add("task-text");
            span.textContent = newText;
            input.replaceWith(span);
            saveTasks();
        } else {
            taskItem.remove();
            saveTasks();
        }
    }

    addButton.addEventListener("click", () => addTask());
    deleteAllButton.addEventListener("click", deleteAllTasks);
    taskList.addEventListener("click", handleTaskActions);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

    loadTasks();
});
document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskNameInput = document.getElementById('taskNameInput');
    const todoColumn = document.getElementById('to-do');
    const messageContainer = document.getElementById('messageContainer');

    addTaskButton.addEventListener('click', createTask);
    taskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTask();
        }
    });

    function createTask() {
        const taskName = taskNameInput.value.trim();

        if (taskName === '') {
            alert('Please enter a task name.');
            return;
        }

        const taskCard = document.createElement('div');
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        taskCard.classList.add('task-card');
        taskCard.setAttribute('draggable', 'true');
        taskCard.id = `task-${Date.now()}`;
        taskCard.innerHTML = `
            <h3>${taskName}</h3>
            <p>Date Added: ${currentDate}</p>
        `;

        taskCard.addEventListener('dragstart', drag);
        taskCard.addEventListener('dragend', dragEnd);

        todoColumn.appendChild(taskCard);
        taskNameInput.value = '';
    }

    function drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
        setTimeout(() => {
            ev.target.classList.add('dragging');
        }, 0);
    }

    function dragEnd(ev) {
        ev.target.classList.remove('dragging');
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData('text');
        const draggedElement = document.getElementById(data);
        let dropTarget = ev.target;

        while (!dropTarget.classList.contains('column')) {
            dropTarget = dropTarget.parentElement;
            if (!dropTarget) return;
        }

        dropTarget.appendChild(draggedElement);

        if (dropTarget.id === 'completed') {
            draggedElement.classList.add('completed');
            displayCompletionMessage(draggedElement.querySelector('h3').textContent);
        } else {
            draggedElement.classList.remove('completed');
        }
    }

    function displayCompletionMessage(taskName) {
        messageContainer.textContent = `Task "${taskName}" Completed Successfully!`;
        messageContainer.classList.add('show');
        
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 3000);
    }

    window.allowDrop = allowDrop;
    window.drop = drop;
});
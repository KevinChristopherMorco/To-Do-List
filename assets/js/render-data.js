import { sortItemOrder } from "./sort-tasks.js"
import { taskWrapper, listItemNumber } from "./global-dom.js"
// import { archiveTask, deleteTask, finishTask, restoreTask} from "./crud.js"

import { crudTask, deleteTask } from "./crud.js"

export const displayNumberItems = () => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    listItemNumber.forEach((element, i) => {
        if (i === 0) {
            const filteredStorage = storageItems.filter(x => x.taskStatus === 'pending')
            element.textContent = filteredStorage.length
            return;
        }

        if (i === 1) {
            const filteredStorage = storageItems.filter(x => x.taskStatus === 'finished')
            element.textContent = filteredStorage.length
            return;
        }

        if (i === 2) {
            const filteredStorage = storageItems.filter(x => x.taskStatus === 'archived')
            element.textContent = filteredStorage.length
            return;
        }
    })
}

window.addEventListener('load', displayNumberItems)

export const loadItems = (e) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))

    if (storageItems === null) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return;
    }
}

window.addEventListener('load', loadItems)

export const renderTask = (e, type, storage) => {
    let template
    switch (type) {
        case 'pending':
            template = document.querySelector('#pending__task')
            break;
        case 'archived':
            template = document.querySelector('#archive__task')
            break;
        case 'completed':
            template = document.querySelector('#finish__task')
            break;
        default:
            break;
    }

    const sortedTasks = sortItemOrder(e, storage) === undefined ? storage.sort((a, b) => b.taskTier - a.taskTier) : sortItemOrder(e, storage)
    sortedTasks.forEach(task => {
        const templateClone = template.content.cloneNode(true)
        if (type === 'pending') {
            templateClone.querySelector('.task__name').textContent = task.taskName
            templateClone.querySelector('.task__date').textContent = task.taskDate
            templateClone.querySelector('.task__priority').innerHTML = `<span></span>${task.taskPriority}`
            templateClone.querySelector('.task__buttons .primary__btn').addEventListener('click', (e) => crudTask(e, 'finished'))
            templateClone.querySelector('.task__buttons .danger__btn').addEventListener('click', (e) => crudTask(e, 'archived'))
            const priorityColor = templateClone.querySelector('.task__priority')
            switch (priorityColor.textContent) {
                case 'Urgent':
                    priorityColor.classList.add('urgent')
                    break;

                case 'Important':
                    priorityColor.classList.add('important')
                    break;

                case 'Non-urgent':
                    priorityColor.classList.add('non-urgent')
                    break;
                default:
                    throw new Error('No available color for the status')
                    break;
            }
        }
        if (type === 'completed') {
            templateClone.querySelector('.task__name').textContent = task.taskName
            templateClone.querySelector('.task__date').textContent = task.taskDate
        }

        if (type === 'archived') {
            templateClone.querySelector('.task__name').textContent = task.taskName
            templateClone.querySelector('.task__date').textContent = task.taskDate
            templateClone.querySelector('.task__buttons .primary__btn').addEventListener('click', (e) => crudTask(e, 'pending'))
            templateClone.querySelector('.task__buttons .danger__btn').addEventListener('click', deleteTask)
        }
        taskWrapper.appendChild(templateClone)
    })
}

export const loadItemTypes = (e) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    setTimeout(() => {
        const index = window.location.href.indexOf('#')
        const key = window.location.href.slice(index + 1)
        let filteredStorage

        switch (key) {
            case 'toDo':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'pending')
                renderTask(e, 'pending', filteredStorage)
                break;

            case 'done':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'finished')
                renderTask(e, 'completed', filteredStorage)
                break;

            case 'deleted':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'archived')
                renderTask(e, 'archived', filteredStorage)
                break;

            default:
                throw new Error('Route does not exist')
                break;
        }
    }, 200)
}

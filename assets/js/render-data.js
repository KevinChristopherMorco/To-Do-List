import { sortItemOrder } from "./sort-tasks.js"
import { dateEl, taskWrapper, list, listItemNumber } from "./global-dom.js"
import { crudTask, deleteTask } from "./crud.js"

const date = new Date()
dateEl.textContent = `${date.toLocaleString('en-PH', { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleString('en-PH', { month: 'short' })}`
console.log(date)

export const displayNumberItems = () => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    listItemNumber.forEach((element, i) => {
        if (i === 0) {
            if (storageItems === null) {
                element.textContent = '0'
                return;
            }

            const filteredStorage = storageItems.filter(x => x.taskStatus === 'pending')
            element.textContent = filteredStorage.length
            return;
        }

        if (i === 1) {
            if (storageItems === null) {
                element.textContent = '0'
                return;
            }

            const filteredStorage = storageItems.filter(x => x.taskStatus === 'finished')
            element.textContent = filteredStorage.length
            return;
        }

        if (i === 2) {
            if (storageItems === null) {
                element.textContent = '0'
                return;
            }

            const filteredStorage = storageItems.filter(x => x.taskStatus === 'archived')
            element.textContent = filteredStorage.length
            return;
        }
    })
}

window.addEventListener('load', displayNumberItems)

export const loadItems = (e) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const getActiveURL = localStorage.getItem('activeURL')
    const index = window.location.href.indexOf('#')

    list.querySelectorAll('li > a').forEach(element => {
        if (element.href.slice(index + 1) === getActiveURL){
            element.closest('li').classList.add('active')
        }
    })

    const filteredStorage = storageItems.filter(x => x.taskStatus === getActiveURL)

    renderTask(e,getActiveURL,filteredStorage)

    checkEmptyStorage(storageItems)

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
        case 'finished':
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
        if (type === 'finished') {
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

        if (storageItems === null) {
            checkEmptyStorage(storageItems)
            return;
        }

        switch (key) {
            case 'pending':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'pending')
                localStorage.setItem('activeURL', 'pending')
                checkEmptyTasks(filteredStorage)
                renderTask(e, 'pending', filteredStorage)
                break;

            case 'finished':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'finished')
                localStorage.setItem('activeURL', 'finished')
                checkEmptyTasks(filteredStorage)
                renderTask(e, 'finished', filteredStorage)
                break;

            case 'archived':
                filteredStorage = storageItems.filter(x => x.taskStatus === 'archived')
                localStorage.setItem('activeURL', 'archived')
                checkEmptyTasks(filteredStorage)
                renderTask(e, 'archived', filteredStorage)
                break;

            default:
                throw new Error('Route does not exist')
                break;
        }
    }, 200)
}

const checkEmptyStorage = (element) => {
    if (element === null) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return;
    }
}

const checkEmptyTasks = (element) => {
    if (taskWrapper.querySelector('.empty__task-container') != null) {
        taskWrapper.querySelector('.empty__task-container').remove()
    }

    if (element.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return;
    }
}

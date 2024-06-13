import { sortItemOrder } from "./sort-tasks.js"
import { dateEl, taskWrapper, list, listItemNumber } from "./global-dom.js"
import { crudTask, deleteTask } from "./crud.js"
import { checkURL, visualEmptyStorage } from "./helpers.js"
import { getModalState } from "./modal.js"

const dateObj = new Date()
const UTCdate = new Date(dateObj.toISOString())
const localDate = new Date(UTCdate.getTime());

dateEl.textContent = `${localDate.toLocaleString('en-PH', { weekday: 'long' })}, ${localDate.getDate()} ${localDate.toLocaleString('en-PH', { month: 'short' })}`


export const displayNumberItems = () => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const status = ['pending', 'finished', 'archived']

    listItemNumber.forEach((listItem, i) => {
        if (i < status.length) {
            const filteredStorage = storageItems.filter(list => list.taskStatus === status[i]);
            listItem.textContent = filteredStorage.length;
        }
    })
}

window.addEventListener('load', displayNumberItems)

export const loadItems = (e) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const getActiveURL = localStorage.getItem('activeURL')
    const index = window.location.href.indexOf('#')

    list.querySelectorAll('li > a').forEach(element => {
        if (element.href.slice(index + 1) === getActiveURL) {
            element.closest('li').classList.add('active')
        }
    })

    getModalState()
    checkTaskDeadline(storageItems)

    const filteredStorage = storageItems.filter(x => x.taskStatus === getActiveURL)
    visualEmptyStorage(filteredStorage)
    renderTask(e, getActiveURL, filteredStorage)
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
        templateClone.querySelector('.task__name').textContent = task.taskName
        templateClone.querySelector('.task__date').textContent = task.taskDate
        templateClone.querySelector('.task__time').textContent = `${task.taskStartTime} - ${task.taskEndTime}`
        if (type === 'pending') {
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
        if (type === 'archived') {
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

        visualEmptyStorage(storageItems)
        
        switch (key) {
            case 'pending':
                checkURL(e, 'pending', storageItems)
                break;

            case 'finished':
                checkURL(e, 'finished', storageItems)
                break;

            case 'archived':
                checkURL(e, 'archived', storageItems)
                break;

            default:
                throw new Error('Route does not exist')
                break;
        }
    }, 200)
}

const checkTaskDeadline = (tasks) => {
    const storageArray = []
    const serverTime = new Date(localDate.toLocaleString('en-PH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }))

    if (storageArray.length === 0 && tasks != null) {
        JSON.parse(localStorage.getItem('taskDetails')).forEach((element, i) => {
            const taskDate = new Date(`${element.taskDate} ${element.taskEndTime}`)
            if (serverTime > taskDate && element.taskStatus === 'pending') {
                element.taskStatus = 'archived'
            }
            storageArray.push(element)
        })
        localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    }
}


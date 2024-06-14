import { sortItemOrder } from "./sort-tasks.js"
import { dateEl, taskWrapper, list, listItemNumber, localDate, serverTime, storageItems } from "./global-dom.js"
import { crudTask, deleteTask } from "./crud.js"
import { checkActiveURL, emptyStorageNotice, checkTaskDeadline, setSortContainer, checkEmptyTasks } from "./helpers.js"
import { getModalState } from "./modal.js"

console.log()
dateEl.textContent = localDate.toLocaleDateString('en-ph',
    {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })


export const displayNumberItems = () => {
    const status = ['pending', 'finished', 'archived']



    listItemNumber.forEach((listItem, i) => {
        if (checkEmptyTasks(taskWrapper, storageItems)) {
            listItem.textContent = '0'
            return;
        }

        if (i < status.length) {
            const filteredStorage = storageItems.filter(list => list.taskStatus === status[i]);
            listItem.textContent = filteredStorage.length;
        }
    })
}

window.addEventListener('load', displayNumberItems)

export const loadItems = (e) => {
    getModalState()

    if (checkEmptyTasks(taskWrapper, storageItems)) {
        return;
    }

    const index = window.location.href.indexOf('#')
    let getActiveURL = localStorage.getItem('activeURL')

    list.querySelectorAll('li > a').forEach((element, i) => {
        if (i === 0 && index === -1) {
            element.closest('li').classList.add('active')
            return
        }

        if (element.href.slice(index + 1) === getActiveURL) {
            element.closest('li').classList.add('active')
        }
    })

    let filteredStorage
    if (index === -1) {
        filteredStorage = storageItems.filter(storage => storage.taskStatus === 'pending')
        getActiveURL = 'pending'
    } else {
        filteredStorage = storageItems.filter(storage => storage.taskStatus === getActiveURL)
    }

    setSortContainer(filteredStorage)
    checkTaskDeadline(storageItems)
    checkEmptyTasks(taskWrapper, filteredStorage)
    renderTask(e, getActiveURL, filteredStorage)
}

window.addEventListener('load', loadItems)

export const renderTask = (e, type, storage) => {

    const keyMap = {
        'pending': '#pending__task',
        'finished': '#finish__task',
        'archived': '#archive__task'
    }

    let template = keyMap[type]

    if (template) {
        template = document.querySelector(template)
    }

    const sortedTasks = sortItemOrder(e, storage) === undefined ? storage.sort((a, b) => b.taskTier - a.taskTier) : sortItemOrder(e, storage)
    sortedTasks.forEach(task => {
        const templateClone = template.content.cloneNode(true)
        //Common template
        templateClone.querySelector('.task__name').textContent = task.taskName
        templateClone.querySelector('.task__date').textContent = task.taskDate
        templateClone.querySelector('.task__time').textContent = `${task.taskStartTime} - ${task.taskEndTime}`
        templateClone.querySelector('.task__priority').innerHTML = `<span></span>${task.taskPriority}`

        const primaryBtn = templateClone.querySelector('.task__buttons .primary__btn')
        const dangerBtn = templateClone.querySelector('.task__buttons .danger__btn')

        const priorityColor = templateClone.querySelector('.task__priority')
        const priorityMap = {
            'Urgent': 'urgent',
            'Important': 'important',
            'Non-urgent': 'non-urgent'
        }
        console.log(priorityMap[priorityColor.textContent])

        const priorityClass = priorityMap[priorityColor.textContent]

        if (!priorityClass) {
            throw new Error('No available color for the status')
        }

        priorityColor.classList.add(priorityClass)


        if (type === 'pending') {
            const taskDate = new Date(`${task.taskDate} ${task.taskEndTime}`)
            console.log(-1800000 < (serverTime - taskDate),(serverTime - taskDate))
            if (-1800000 < (serverTime - taskDate)) {
                templateClone.querySelector('.task__card').classList.add('task__card--deadline')
                templateClone.querySelector('.task__near-deadline').innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Crunch Time '

            }
            primaryBtn.addEventListener('click', (e) => crudTask(e, 'finished'))
            dangerBtn.addEventListener('click', (e) => crudTask(e, 'archived'))
        }

        if (type === 'archived') {
            if (serverTime > new Date(task.taskDate)) {
                primaryBtn.remove();
            } else {
                primaryBtn.addEventListener('click', (e) => crudTask(e, 'pending'));
            }

            dangerBtn.addEventListener('click', deleteTask);
        }
        taskWrapper.appendChild(templateClone)
    })
}

export const loadItemTypes = (e) => {
    setTimeout(() => {
        const index = window.location.href.indexOf('#')
        const key = window.location.href.slice(index + 1)

        checkEmptyTasks(taskWrapper, storageItems)

        const keyMap = {
            'pending': 'pending',
            'finished': 'finished',
            'archived': 'archived'
        }

        const currentURL = keyMap[key]

        if (currentURL) {
            checkActiveURL(e, currentURL, storageItems)
        }

    }, 200)
}


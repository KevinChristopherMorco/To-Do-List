import { sortItemOrder } from "./sort-tasks.js"
import { dateEl, taskWrapper, list, listItemNumber, localDate, serverTime, storageItems } from "./global-dom.js"
import { crudTask, deleteTask } from "./crud.js"
import { checkActiveURL, checkTaskDeadline, setSortContainer, checkEmptyTasks, customMap} from "./helpers.js"
import { getModalState } from "./modal.js"

dateEl.textContent = localDate().toLocaleDateString('en-ph',
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
    checkTaskDeadline(storageItems)

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
    checkEmptyTasks(taskWrapper, filteredStorage)
    renderTask(e, getActiveURL, filteredStorage)
}

window.addEventListener('load', loadItems)

export const renderTask = (e, currentURL, storage) => {
    let template = customMap(['pending', '#pending__task','finished','#finish__task','archived', '#archive__task'],currentURL)

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

        const taskDate = new Date(`${task.taskDate} ${task.taskEndTime}`)

        const priorityColor = templateClone.querySelector('.task__priority')
        const priorityClass = customMap(['Urgent', 'urgent','Important','important','Non-urgent', 'non-urgent'],priorityColor.textContent)

        if (!priorityClass) {
            throw new Error('No available color for the status')
        }

        priorityColor.classList.add(priorityClass)

        if (currentURL === 'pending') {
            const minsRemaining = Math.abs(serverTime().getMinutes() - task.taskEndTime.slice(3))
            if ((serverTime() - taskDate) > -1800000) {
                templateClone.querySelector('.task__card').classList.add('task__card--deadline')
                templateClone.querySelector('.task__near-deadline').innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Down to the Wire <br>
                (${minsRemaining === 0 ? `under a minute left` : `${minsRemaining === 1 ? `${minsRemaining} minute left` : `${minsRemaining} minutes left`} `})`
            }
            primaryBtn.addEventListener('click', (e) => crudTask(e, taskDate, 'finished'))
            dangerBtn.addEventListener('click', (e) => crudTask(e, taskDate, 'archived'))
        }

        if (currentURL === 'archived') {
            if (serverTime() > taskDate) {
                primaryBtn.remove();
            } else {
                primaryBtn.addEventListener('click', (e) => crudTask(e, taskDate, 'pending'));
            }

            dangerBtn.addEventListener('click',(e)=> deleteTask(e,taskDate));
        }
        taskWrapper.appendChild(templateClone)
    })
}

export const loadItemTypes = (e) => {
    setTimeout(() => {
        const index = window.location.href.indexOf('#')
        const key = window.location.href.slice(index + 1)
        
        const currentURL = customMap(['pending', 'pending','finished','finished','archived', 'archived'], key)

        if (currentURL) {
            checkActiveURL(e, currentURL, storageItems)
        }

        if(checkEmptyTasks(taskWrapper,storageItems)){
            return;
        }

        const filteredStorage = storageItems.filter(storage => storage.taskStatus === currentURL)

        checkEmptyTasks(taskWrapper, filteredStorage)
    }, 200)
}


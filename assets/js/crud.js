import { clear } from "./helpers.js"
const storageArray = []

export const addTask = () => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    if (storageArray.length === 0 && storageItems != null) {
        JSON.parse(localStorage.getItem('taskDetails')).forEach(element => {
            storageArray.push(element)
        })
    }

    const taskName = document.querySelector('#task-name')
    const taskDate = document.querySelector('#task-date')
    const taskPriority = document.querySelector('#priority-list')

    let id
    storageArray.length === 0 ? id = 1 : id = storageItems[storageItems.length - 1].id + 1

    const convertDate = new Date(taskDate.value)
    const convertTaskDate = `${convertDate.toLocaleString('en-PH', { weekday: 'long' })}, ${convertDate.getDate()} ${convertDate.toLocaleString('en-PH', { month: 'short' })}`

    let taskTier
    switch (taskPriority.value) {
        case 'Urgent':
            taskTier = 1
            break;

        case 'Important':
            taskTier = 2
            break;

        case 'Non-urgent':
            taskTier = 3
            break;

        default:
            break;
    }

    const items = {
        'id': id,
        'taskName': taskName.value,
        'taskDate': convertTaskDate,
        'taskPriority': taskPriority.value,
        'taskTier': taskTier,
        'taskStatus': 'pending'
    }

    storageArray.push(items)
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    clear([taskName, taskDate, taskPriority])
}

export const crudTask = (e,status) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const index = storageItems.findIndex(x => x.taskName === e.target.closest('.task__details').querySelector('.task__name').textContent)
    storageItems[index].taskStatus = status
    localStorage.setItem('taskDetails',JSON.stringify(storageItems))
}

export const deleteTask = (e) => {
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const index = storageItems.findIndex(x => x.taskName === e.target.closest('.task__details').querySelector('.task__name').textContent)
    if (storageArray.length === 0 && storageItems != null) {
        JSON.parse(localStorage.getItem('taskDetails')).forEach((element,i) => {
            if(i === index)return;
            storageArray.push(element)
        })
    }   
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
}
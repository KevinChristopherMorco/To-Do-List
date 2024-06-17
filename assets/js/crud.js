import { clearInput, customMap } from "./helpers.js"
import { serverTime, storageItems } from "./global-dom.js"
const storageArray = []

export const addTask = () => {
    if (storageArray.length === 0 && storageItems != null) {
        storageItems.forEach(element => {
            storageArray.push(element)
        })
    }

    const forms = document.querySelectorAll('.form__task-container > form input, .form__task-container > form select');
    const taskName = document.querySelector('#task-name')
    const taskStartDate = document.querySelector('#task-start-date')
    const taskEndDate = document.querySelector('#task-end-date')
    const taskStartTime = document.querySelector('#task-start-time')
    const taskEndTime = document.querySelector('#task-end-time')
    const taskPriority = document.querySelector('#priority-list')

    const errorStatus = document.querySelectorAll('.input__error')

    let startDate = new Date(taskStartDate.value)
    let endDate = new Date(taskEndDate.value)

    forms.forEach((element, i) => {
        if (element.value === '' || element.value === 'Priority List') {
            element.classList.add('input--error')
            errorStatus[i].style.display = 'block'
            errorStatus[i].innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid Input'
        } else {
            element.classList.remove('input--error')
            errorStatus[i].style.display = 'none'
        }

        if(element.type === 'date'){
            if(taskStartDate.value > taskEndDate.value){
                element.classList.add('input--error')
                errorStatus[i].style.display = 'block'
                errorStatus[i].innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid date range'
            }
        }

        if(element.type === 'time'){
            if(startDate.getTime() === endDate.getTime() && taskEndTime.value < taskStartTime.value){
                element.classList.add('input--error')
                errorStatus[i].style.display = 'block'
                errorStatus[i].innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid time range'
            }
        }
    });

    if (Array.from(forms).some(form => form.classList.contains('input--error') || form.value === 'Priority List')) return;

    let id
    storageArray.length === 0 ? id = 1 : id = storageItems[storageItems.length - 1].id + 1

    const taskTier = customMap(['Urgent', 1, 'Important', 2, 'Non-urgent', 3], taskPriority.value)

    let convertStartDate = startDate.toLocaleString('en-PH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const convertEndDate = endDate.toLocaleString('en-PH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const items = {
        'id': id,
        'taskName': taskName.value,
        'taskStartDate': convertStartDate,
        'taskStartTime': taskStartTime.value,
        'taskEndDate': convertEndDate,
        'taskEndTime': taskEndTime.value,
        'taskPriority': taskPriority.value,
        'taskTier': taskTier,
        'taskStatus': 'pending'
    }


    storageArray.push(items)
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    clearInput([taskName, taskEndDate, taskPriority])
    location.reload()
}

export const crudTask = (e, date, status) => {
    const index = storageItems.findIndex(x => x.taskName === e.target.closest('.task__details').querySelector('.task__name').textContent)
    if (serverTime() > date) {
        console.error('Invalid Action')
        return;
    }
    storageItems[index].taskStatus = status
    localStorage.setItem('taskDetails', JSON.stringify(storageItems))
    location.reload()
}

export const deleteTask = (e, date) => {
    const index = storageItems.findIndex(x => x.taskName === e.target.closest('.task__details').querySelector('.task__name').textContent)
    if (storageItems != null) {
        storageItems.forEach((element, i) => {
            if (i === index) return;
            storageArray.push(element)
        })
    }
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    location.reload()
}
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
    const taskDate = document.querySelector('#task-date')
    const taskStartTime = document.querySelector('#task-start-time')
    const taskEndTime = document.querySelector('#task-end-time')
    const taskPriority = document.querySelector('#priority-list')

    let id
    storageArray.length === 0 ? id = 1 : id = storageItems[storageItems.length - 1].id + 1

    const convertDate = new Date(taskDate.value)
    let convertTaskDate = convertDate.toLocaleString('en-PH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const taskTier = customMap(['Urgent', 1, 'Important', 2, 'Non-urgent', 3], taskPriority.value)

    // // If end time is before start time and it's after midnight (i.e., endHour < startHour)
    // if (taskEndTime.value, taskStartTime.value, taskEndTime.value < taskStartTime.value) {
    //     // Increment the selected date by 1 day
    //     convertDate.setDate(convertDate.getDate() + 1);
    //     convertDate.getFullYear();
    //     String(convertDate.getMonth() + 1).padStart(2, '0');
    //     String(convertDate.getDate()).padStart(2, '0');

    //     // Update date input to the next day
    //     convertTaskDate = convertDate.toLocaleString('en-PH', {
    //         weekday: 'short',
    //         day: 'numeric',
    //         month: 'short',
    //         year: 'numeric',
    //     })
    // }


    const items = {
        'id': id,
        'taskName': taskName.value,
        'taskDate': convertTaskDate,
        'taskStartTime': taskStartTime.value,
        'taskEndTime': taskEndTime.value,
        'taskPriority': taskPriority.value,
        'taskTier': taskTier,
        'taskStatus': 'pending'
    }
    const errorStatus = document.querySelectorAll('.input__error')

    forms.forEach((element, i) => {
        if (element.value === '' || element.value === 'Priority List') {
            element.classList.add('input--error')
            errorStatus[i].style.display = 'block'
            errorStatus[i].innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid Input'

        } else {
            element.classList.remove('input--error')
            errorStatus[i].style.display = 'none'
        }
    });

    if (Array.from(forms).some(form => form.value === '' || form.value === 'Priority List')) return;

    storageArray.push(items)
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    clearInput([taskName, taskDate, taskPriority])
    // location.reload()
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
    if (serverTime() > date) {
        console.error('Invalid Action')
        return;
    }
    if (storageItems != null) {
        storageItems.forEach((element, i) => {
            if (i === index) return;
            storageArray.push(element)
        })
    }
    localStorage.setItem('taskDetails', JSON.stringify(storageArray))
    location.reload()
}
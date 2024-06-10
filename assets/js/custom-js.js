const taskWrapper = document.querySelector('.task__container')
const addBtn = document.querySelector('.task-add__container > button')
const dateEl = document.querySelector('.date-info__container > p:nth-of-type(2)')

const date = new Date()
dateEl.textContent = `${date.toLocaleString('en-PH', { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleString('en-PH', { month: 'short' })}`
const storageItems = []

const openModal = (e) => {
    const addModalTemplate = document.querySelector('#modal__template')
    const addClone = addModalTemplate.content.cloneNode(true)
    const el = addClone.querySelector('.modal__task-add')
    addClone.querySelector('.modal__header > p:nth-of-type(2)').addEventListener('click', (e) => closeModal(e, el))
    addClone.querySelector('.modal__footer > button').addEventListener('click', (e) => addTask(e))
    taskWrapper.appendChild(addClone)
    modalState(true)
}

addBtn.addEventListener('click', (e) => openModal(e))

const closeModal = (e, el) => {
    el.remove()
    modalState(false)

}

const addTask = () => {

    if (storageItems.length === 0 && localStorage.length != 0 && JSON.parse(localStorage.getItem('taskDetails').length != 0)) {
        JSON.parse(localStorage.getItem('taskDetails')).forEach(element => {
            storageItems.push(element)
        })
    }

    const taskName = document.querySelector('#task-name')
    const taskDate = document.querySelector('#task-date')
    const taskPriority = document.querySelector('#priority-list')

    let id
    storageItems.length === 0 ? id = 1 : id = storageItems[storageItems.length - 1].id + 1

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

    storageItems.push(items)
    localStorage.setItem('taskDetails', JSON.stringify(storageItems))
    clear([taskName, taskDate, taskPriority])

}

const clear = (elements) => {
    elements.forEach(element => {
        if (element.tagName === 'SELECT') {
            element.value = [...element.options][0].text
            return;
        }
        element.value = ''
    });
}

const loadItems = (e) => {
    if (localStorage.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return;
    }

    const pendingTemplate = document.querySelector('#pending__task')
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))

    const check = sort(e) === undefined ? storageItems.sort((a, b) => b.taskTier - a.taskTier) : sort(e)

    check.forEach(element => {
        const pendingClone = pendingTemplate.content.cloneNode(true)
        pendingClone.querySelector('.task__name').textContent = element.taskName
        pendingClone.querySelector('.task__date').textContent = element.taskDate
        pendingClone.querySelector('.task__priority').innerHTML = `<span></span>${element.taskPriority}`
        pendingClone.querySelector('.task__date').textContent = element.taskDate
        pendingClone.querySelector('.task__buttons .primary__btn').addEventListener('click', finishTask)
        pendingClone.querySelector('.task__buttons .danger__btn').addEventListener('click', archiveTask)

        const priorityColor = pendingClone.querySelector('.task__priority')

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
        taskWrapper.appendChild(pendingClone)
    })
}

window.addEventListener('load', loadItems)

const modalState = (isOpen) => {
    console.log(isOpen === true ? 'open' : 'close')
}

const sortType = document.querySelector('.sort__container')

const sortItemType = () => {
    clearCards()
    const storageItems = JSON.parse(localStorage.getItem('taskDetails'))
    const typeValue = taskWrapper.querySelector('#sort-type')
    switch (typeValue.value) {
        case 'name':
            return storageItems.sort((a, b) => a.taskName.localeCompare(b.taskName))
        case 'priority':
            return storageItems.sort((a, b) => a.taskTier - b.taskTier)
        case 'date':
            return storageItems.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))
        default:
            break;
    }
}

const sortItemOrder = () => {
    clearCards()
    const orderValue = taskWrapper.querySelector('#sort-order')
    switch (orderValue.value) {
        case 'ascending':
            return sortItemType()
            break;
        // return element.sort((a, b) => b.taskName - a.taskName)

        case 'descending':
            return sortItemType().reverse()
            break;

        // return element.sort((a, b) => a.taskTier - b.taskTier)
        default:
            break;
    }
}

const sort = (e) => {
    return sortItemOrder()
}

const clearCards = () => {
    const cards = taskWrapper.querySelectorAll('.task__card')
    cards.forEach(card => {
        card.remove()
    })
}

sortType.addEventListener('change', (e) => loadItems(e))


const archiveTask = () => {
    console.log('archived')
}

const finishTask = () => {
    console.log('finished')
}




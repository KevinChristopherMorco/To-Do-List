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

    const items = {
        'id': id,
        'taskName': taskName.value,
        'taskDate': convertTaskDate,
        'taskPriority': taskPriority.value,
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

const loadItems = () => {
    const pendingTemplate = document.querySelector('#pending__task')
    JSON.parse(localStorage.getItem('taskDetails')).forEach(element => {
        const pendingClone = pendingTemplate.content.cloneNode(true)
        console.log(element)
        pendingClone.querySelector('.task__name').textContent = element.taskName
        pendingClone.querySelector('.task__date').textContent = element.taskDate
        pendingClone.querySelector('.task__priority').innerHTML = `<span></span>${element.taskPriority}`
        taskWrapper.appendChild(pendingClone)
    })
}

window.addEventListener('load', loadItems)

const modalState = (isOpen) => {
    console.log(isOpen === true ? 'open' : 'close')
}

console.log(JSON.parse(localStorage.getItem('taskDetails')))

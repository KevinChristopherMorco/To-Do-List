const taskWrapper = document.querySelector('.task__container')
const addBtn = document.querySelector('.task-add__container > button')
const dateEl = document.querySelector('.date-info__container > p:nth-of-type(2)')

const date = new Date()
console.log()
dateEl.textContent = `${date.toLocaleString('en-PH', { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleString('en-PH', { month: 'short' })}`
console.log()

const addTask = (e) => {
    const pendingTemplate = document.querySelector('#pending__task')
    const pendingClone = pendingTemplate.content.cloneNode(true)
    taskWrapper.appendChild(pendingClone)
}

addBtn.addEventListener('click', (e) => addTask(e))
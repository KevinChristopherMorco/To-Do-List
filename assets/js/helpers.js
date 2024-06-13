import { taskWrapper, list } from "./global-dom.js"
import {renderTask, loadItemTypes } from "./render-data.js"

export const clearCards = () => {
    const cards = taskWrapper.querySelectorAll('.task__card')
    cards.forEach(card => {
        card.remove()
    })
}

export const clear = (elements) => {
    elements.forEach(element => {
        if (element.tagName === 'SELECT') {
            element.value = [...element.options][0].text
            return;
        }
        element.value = ''
    });
}

const handleListClick = (e) => {
    Array.from(document.querySelector('.main__list').children).forEach(element => {
        element.classList.remove('active')
    })

    if (e.target.tagName === 'A' || e.target.tagName === 'SPAN' || e.target.tagName === 'LI') {
        e.target.closest('.list__item').classList.add('active')
    }
    loadItemTypes(e)
}

list.addEventListener('click', (e) => handleListClick(e))

export const checkURL = (e, status, storageItems) => {
    const filteredStorage = storageItems.filter(x => x.taskStatus === status)
    localStorage.setItem('activeURL', status)
    checkEmptyTasks(taskWrapper,filteredStorage)
    renderTask(e, status, filteredStorage)
}

const checkEmptyTasks = (element,storage) => {
    if (element.querySelector('.empty__task-container') != null) {
        element.querySelector('.empty__task-container').remove()
    }

    if (storage.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        element.appendChild(emptyTaskClone)
        return;
    }
}

export const visualEmptyStorage = (element) => {
    if (element === null || element.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return;
    }
}


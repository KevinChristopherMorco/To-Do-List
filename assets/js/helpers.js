import { taskWrapper, list,serverTime, storageItems } from "./global-dom.js"
import {renderTask, loadItemTypes, displayNumberItems } from "./render-data.js"

export const clearCards = () => {
    const cards = taskWrapper.querySelectorAll('.task__card')
    cards.forEach(card => {
        card.remove()
    })
}

export const clearInput = (elements) => {
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

export const checkActiveURL = (e, currentURL, storageItems) => {
    if (checkEmptyTasks(taskWrapper,storageItems)) {
        return;
    }

    const filteredStorage = storageItems.filter(x => x.taskStatus === currentURL)
    localStorage.setItem('activeURL', currentURL)
    setSortContainer(filteredStorage)
    checkEmptyTasks(taskWrapper,filteredStorage)
    renderTask(e, currentURL, filteredStorage)
}

export const checkEmptyTasks = (element,storage) => {
    if (element.querySelector('.empty__task-container') != null) {
        element.querySelector('.empty__task-container').remove()
    }

    if (storage === null || storage.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        element.appendChild(emptyTaskClone)
        return true
    }
}

export const checkTaskDeadline = (tasks) => {
    const storageArray = []
    if (storageArray.length === 0 && tasks != null) {
        storageItems.forEach(element => {
            const taskDate = new Date(`${element.taskDate} ${element.taskEndTime}`)
            if (serverTime() > taskDate && element.taskStatus === 'pending') {
                element.taskStatus = 'archived'
            }
            storageArray.push(element)
        })
        localStorage.setItem('taskDetails', JSON.stringify(storageArray))
        displayNumberItems()
    }
}


export const emptyStorageNotice = (element) => {
    if (element === null || element.length === 0) {
        const emptyTaskTemplate = document.querySelector('#empty__task')
        const emptyTaskClone = emptyTaskTemplate.content.cloneNode(true)
        taskWrapper.appendChild(emptyTaskClone)
        return true
    }
}

export const setSortContainer = (storage) => {
    const sortTemplate = document.querySelector('#sort__template')
    const clone = sortTemplate.content.cloneNode(true)
    const sortContainer = taskWrapper.querySelector('.sort__container')

    if(storage.length === 0){
        sortContainer?.remove()
        return;
    }

    if(sortContainer != null)return;

    clone.querySelector('.sort__container').addEventListener('change', (e) => loadItemTypes(e))
    taskWrapper.insertBefore(clone, taskWrapper.firstElementChild)
}

export const customMap = (elements,value) => {
    const obj = {}
    elements.forEach((element,i)=> {
        if(i % 2 === 0){
          obj[element] = elements[i + 1]
        }
    })
    return obj[value]
}
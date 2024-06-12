import { taskWrapper, addBtn } from "./global-dom.js"
import { addTask } from "./crud.js"

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

const modalState = (isOpen) => {
    console.log(isOpen === true ? 'open' : 'close')
}
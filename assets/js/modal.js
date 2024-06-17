import { taskWrapper, addBtn,serverTime } from "./global-dom.js"
import { addTask } from "./crud.js"

export const openModal = (e) => {
    const addModalTemplate = document.querySelector('#modal__template')
    const addClone = addModalTemplate.content.cloneNode(true)
    const modal = addClone.querySelector('.modal__task-add')
    
    const year = serverTime().getFullYear();
    const month = String(serverTime().getMonth() + 1).padStart(2, '0');
    const day = String(serverTime().getDate()).padStart(2, '0');

    // Format the date as yyyy-mm-dd
    const todayFormatted = `${year}-${month}-${day}`;

    // Set the min attribute of the date input to today's date
    addClone.querySelector('#task-date').setAttribute('min', todayFormatted);

    addClone.querySelector('.modal__header > p:nth-of-type(2)').addEventListener('click', (e) => closeModal(e, modal))
    addClone.querySelector('.modal__footer > button').addEventListener('click', (e) => addTask(e))
    taskWrapper.appendChild(addClone)
    setModalState(true)
}

addBtn.addEventListener('click', (e) => openModal(e))

export const closeModal = (e, modal) => {
    modal.remove()
    setModalState(false)
}

const setModalState = (isOpen) => {
    isOpen === true ? localStorage.setItem('modalState', 'isOpen') : localStorage.setItem('modalState', 'isClosed')
}

export const getModalState = () => {
    const modalState = localStorage.getItem('modalState')
    modalState === 'isOpen' ? openModal() : closeModal
}
import { taskWrapper, list } from "./global-dom.js"
import { loadItemTypes } from "./render-data.js"

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


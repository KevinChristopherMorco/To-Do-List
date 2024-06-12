import { clearCards} from "./helpers.js"
import { taskWrapper } from "./global-dom.js"
import { loadItemTypes, renderTask } from "./render-data.js"
const sortType = document.querySelector('.sort__container')

const sortItemType = (storage) => {
    clearCards()
    const typeValue = taskWrapper.querySelector('#sort-type')

    if (storage === null) return;

    switch (typeValue.value) {
        case 'name':
            localStorage.setItem('sortType', 'name')
            return storage.sort((a, b) => a.taskName.localeCompare(b.taskName))
        case 'priority':
            localStorage.setItem('sortType', 'priority')
            return storage.sort((a, b) => a.taskTier - b.taskTier)
        case 'date':
            localStorage.setItem('sortType', 'date')
            return storage.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))
        default:
            break;
    }
}

export const sortItemOrder = (e,storage) => {
    clearCards()
    const orderValue = taskWrapper.querySelector('#sort-order')
    switch (orderValue.value) {
        case 'ascending':
            localStorage.setItem('sortOrder', 'ascending')
            return sortItemType(storage)
            break;
        case 'descending':
            localStorage.setItem('sortOrder', 'descending')
            return sortItemType(storage).reverse()
            break;
        default:
            break;
    }
}

sortType.addEventListener('change', (e) => loadItemTypes(e))



import { clearCards} from "./helpers.js"
import { taskWrapper } from "./global-dom.js"
import { loadItemTypes, renderTask } from "./render-data.js"

const sortItemType = (storage) => {
    clearCards()
    const typeValue = taskWrapper.querySelector('#sort-type')

    if (storage === null) return;
    const sortType = JSON.parse(localStorage.getItem('sortType'));

    setSortState(typeValue,sortType,'sortType')

    switch (sortType) {
        case 'name':
            return storage.sort((a, b) => a.taskName.localeCompare(b.taskName))
        case 'priority':
            return storage.sort((a, b) => a.taskTier - b.taskTier)
        case 'date':
            return storage.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))
        default:
            break;
    }
}

export const sortItemOrder = (e,storage) => {
    clearCards()
    const orderValue = taskWrapper.querySelector('#sort-order')
    if(orderValue === null) return;

    const sortOrder = JSON.parse(localStorage.getItem('sortOrder'));

    setSortState(orderValue,sortOrder,'sortOrder')

    switch (sortOrder) {
        case 'ascending':
            return sortItemType(storage)
            break;
        case 'descending':
            return sortItemType(storage).reverse()
            break;
        default:
            break;
    }
}

const setSortState = (element,key,name) => {
    [...element.options].forEach(x => {
        if(x.value === key){
            x.setAttribute('selected', true)
        }
    })
  
    element.addEventListener('change' , (e) => {
        localStorage.setItem(name, JSON.stringify(element.value))
    })
}




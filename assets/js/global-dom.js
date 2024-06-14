export const taskWrapper = document.querySelector('.task__container')
export const addBtn = document.querySelector('.task-add__container > button')
export const dateEl = document.querySelector('.date-info__container > p:nth-of-type(2)')
export const list = document.querySelector('.main__list')
export const listItemNumber = document.querySelectorAll('nav>ul>li>a>span')

export const storageItems = JSON.parse(localStorage.getItem('taskDetails'))


const dateObj = new Date()
const UTCdate = new Date(dateObj.toISOString())
export const localDate = new Date(UTCdate.getTime());

export const serverTime = new Date(localDate.toLocaleString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}))


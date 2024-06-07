const dateEl = document.querySelector('.date-info__container > p:nth-of-type(2)')

const date = new Date()
console.log()
dateEl.textContent = `${date.toLocaleString('en-PH', {weekday: 'long'})}, ${date.getDate()} ${date.toLocaleString('en-PH', {month: 'short'})}`
console.log()
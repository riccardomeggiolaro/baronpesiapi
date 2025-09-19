let date = "2025-09-01T08:37:33.000Z"
let f = new Date(date).toLocaleString("it-IT", { hour: '2-digit', minute: '2-digit' })
console.log(f) 
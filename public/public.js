//const btnLogin = document.getElementById("login")
const btnSave = document.getElementById("save")
const btnSend = document.getElementById("send")
const btnAdd = document.getElementsByClassName("btnAdd")
const btnLogout = document.getElementById("logout")
const socket = io();

btnSave.onclick = e => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const category = document.getElementById('category').value
    const price = document.getElementById('price').value
    const img = document.getElementById('img').value

    socket.emit('add', {name, category, price, img})
}
btnSend.onclick = e => {
    e.preventDefault()
    const date = new Date().toLocaleString()
    const msg = {
        text: document.getElementById( 'text' ).value,
        author: {
            id: document.getElementById('email').value,
            name: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            alias:document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        },
        date: date
    }
    console.log(msg)
    socket.emit('chat-in', msg)
}

btnAdd.onclick = e => {
    e.preventDefault()
    selected = event.target.id
    user
}

socket.on('show', products => {
    console.log(products)

    fetch('/products')
    .then(r => r.text())
    .then(html => {
        const div = document.getElementById('products')
        div.innerHTML = html
    })
    .catch( e => console.log(e))
})
socket.on('chat-out', (messages) => {
    
    const author = new normalizr.schema.Entity('author')
    const msg = new normalizr.schema.Entity('msg', {
        author: author
    })
    const msgList = [msg]
    
    const denormalizedData = normalizr.denormalize(messages, msgList)
    console.log(denormalizedData, msg)
});


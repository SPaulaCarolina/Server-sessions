const MessagesDB = require('../containers/containerMessages')
const messagesDB =  new MessagesDB('../DB/messages.json') 
/*const messages = async (socket) => {
    socket.emit('chat-out', 'new message')
    /*socket.on('add', async data => {
        const dataOut = {
            name: data.name,
            category: data.category,
            price: data.price,
            img: data.img
        }
        productsDB.insert(dataOut)
        const products = await productsDB.getAll()
        console.log(products)
        sockets.emit('show', products)
    })*/
    
    /*socket.on('chat-in', async msg => {
        await messagesDB.insert(msg)
        .then(() => socket.emit('chat-out', messages) )
        
    })
}*/

const msg_router =  require('express').Router()

const MessagesDB = require('../containers/containerMessages')
const messagesDB =  new MessagesDB('./DB/messages.json') 

msg_router.get('/', async (req, res) => {
    res.render('chat', {
        messages: await messagesDB.getAll()
    })
    console.log(messagesDB)
})

module.exports = msg_router;
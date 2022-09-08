const random_router =  require('express').Router()
const { fork } = require('child_process')

random_router.get('/', ( req, res) => {
    const { cant = Math.pow(10, 8) } = req.query
    const count = fork('./randoms.js', [Number(cant)]);
    count.send( cant );
    count.on('message', numbers => {
        return res.json({ numbers })
    })
})

module.exports = random_router
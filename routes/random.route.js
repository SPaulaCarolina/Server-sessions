const random_router =  require('express').Router()
const { fork } = require('child_process')

random_router.get('/', ( req, res) => {
    
    const cant = req.query.cant || 500000000
    
    const count = fork('./randoms.js');
    count.send( {cant} );
    count.on('message', numbers => {
        return res.json(numbers)
    })
})

module.exports = random_router



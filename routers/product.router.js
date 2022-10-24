const express = require('express')
const FactoryDAO = require('../daos/index')
const { Router } = express

//DAO
const DAO = FactoryDAO()
//AUTH
function auth(req, res, next) {
    if( 'admin' in req.headers) next()
    else {
        res.status(400)
        res.send('Error. Usuario no autorizado.')
    }
}
//Routers
const productRouter = Router()
//Product Routes
productRouter.get('/', async (req, res) => res.send(await DAO.product.getAll()))
productRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await DAO.product.getByID(id))
})
productRouter.post('/', async (req, res) => res.send(await DAO.product.save(req.body)))
productRouter.put('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await DAO.product.editByID(req.body, id))  
})
productRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await DAO.product.deleteByID(id))
})

module.exports = productRouter
const express = require('express')
const FactoryDAO = require('../daos/index')
const { Router } = express

//DAO
const DAO = FactoryDAO()
//Routers
const cartRouter = Router()
//Cart Routes
cartRouter.get('/', async (req, res) => res.send(await DAO.cart.getAll()))
cartRouter.post('/', async (req, res) => res.send(await DAO.cart.save(req.body)))
cartRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await DAO.cart.deleteByID(id))
})
cartRouter.get('/:id/products', async (req, res) => { 
    const id = req.params.id
    const cart = await DAO.cart.getByID(id)
    res.send(cart.products)
})
cartRouter.put('/:id/products', async (req, res) => { 
    const id_cart = req.params.id
    const product = req.body
    res.json(await DAO.cart.editByID({products: product}, id_cart))
})

module.exports = cartRouter
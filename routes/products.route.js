const Products = require('../models/product.model')
const Users = require('../models/user.model')

const product_router =  require('express').Router()
const ProductsDB = require('../containers/containerProducts')
const productsDB = new ProductsDB('products')

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/auth/login')
}

product_router.get('/', checkAuth, async (req, res) => {
    res.render('products', {
        products: await productsDB.getAll(),
        listExist: false
    })
})

product_router.get('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await productsDB.getByID(id))
})
//product_router.post('/', async (req, res) => res.send(await cartDB.insert(req.body)))
product_router.put('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await productsDB.editByID(req.body, id))  
})
product_router.delete('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await productsDB.deleteByID(id))
})

module.exports = product_router;
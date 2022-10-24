const cart_router =  require('express').Router()
const Users = require('../models/user.model')

const ProductsDB = require('../containers/containerProducts')
const productsDB = new ProductsDB('products')

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/auth/login')
}

cart_router.get('/:id', checkAuth, async (req, res) => {
    const product_id = req.params.id
    console.log(product_id)
    let email = req.user.email

    const user = await Users.findOne(email)
    const product = await productsDB.getByID(product_id)
    const { _id, name, price, img } = product

    user.cart.push({ _id, name, price, img })

    await Users.save(user)
    const cart = user.cart
    console.log(cart)
})
/* cart_router.get('/:id', checkAuth, async (req, res) => {
    let { email } = req.user.email
    const user = await Users.findOne({email})
    res.render('cart', { user })
}) */

cart_router.get('/', async (req, res) => {
    let username = req.session.passport
    const user = await Users.findOne({username})

    res.render('cart', { user })
})
/* cart_router.post('/', async (req, res) => res.send(await DAO.cart.save(req.body)))
cart_router.delete('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await DAO.cart.deleteByID(id))
})
cart_router.get('/:id/products', async (req, res) => { 
    const id = req.params.id
    const cart = await DAO.cart.getByID(id)
    res.send(cart.products)
})
cart_router.put('/:id/products', async (req, res) => { 
    const id_cart = req.params.id
    const product = req.body
    res.json(await DAO.cart.editByID({products: product}, id_cart))
})*/
module.exports = cart_router;
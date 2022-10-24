const home_router =  require('express').Router()
const {logger, loggerErr} = require('../options/log4js')

const ProductsDB = require('../containers/containerProducts')
const productsDB = new ProductsDB('products')

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/auth/login')
}

home_router.get('/', checkAuth, async (req, res) => {
    try {
        res.render('home', {
            username: req.user.username,
            products: await productsDB.getAll(),
            listExist: false
        })
        logger.info(`${req.method} ${req.url} READY`)
    } catch (e) {
        loggerErr.error(`ERROR: ${req.method}: ${req.url} + ${e}`);
    }
})

home_router.get('/logout', checkAuth, async (req, res) => {
    try {
        const username = req.user.username
        req.session.destroy()
        res.render('logout', {username})
        logger.info(`${req.method} ${req.url} READY`)
    } catch (e) {
        loggerErr.error(`ERROR: ${req.method}: ${req.url} + ${e}`);
    }
})

module.exports = home_router;
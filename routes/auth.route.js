const log4js = require('log4js')
const logger = log4js.getLogger('info')

function getRoot(req, res) {
    res.render('index')
}
function getLogin(req, res) {
    logger.info(`${req.method}: ${req.url}`)
    if(req.isAuthenticated()) {
        res.send('login-ok')
    } else {
        res.render('login')
    }
}
function getFailLogin(req, res) {
    res.render('err-login')
}
function postLogin(req, res) {
    console.log(req.user)

    res.render('home')
}
function getSignup(req, res) {
    res.render('signup')
}
function getFailSignup(req, res) {
    res.render('err-signup')
}
function postSignup(req, res) {
    console.log(req.user)

    res.render('home')
}

module.exports = {
    getRoot,
    getLogin,
    getFailLogin,
    postLogin,
    getSignup,
    getFailSignup,
    postSignup
}
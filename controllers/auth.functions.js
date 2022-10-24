const log4js = require('log4js')
const logger = log4js.getLogger('info')
//const { transporter, mailOpt } = require('../options/nodemailer')

function getRoot(req, res) {
    res.render('index')
}
function getLogin(req, res) {
    logger.info(`${req.method}: ${req.url}`)
    const username = req.body.username
    if(req.isAuthenticated()) {
        res.send('login-ok', {username})
    } else {
        res.render('login')
    }
}
function getFailLogin(req, res) {
    res.render('err-login')
}
function postLogin(req, res) {
    console.log(req.user)
    res.redirect('/home')
}
function getSignup(req, res) {
    res.render('signup')
}
function getFailSignup(req, res) {
    res.render('err-signup')
}
function postSignup(req, res) {
    console.log(req.user)
    res.redirect('/home')
}

module.exports = {
    getRoot,
    getLogin,
    getFailLogin,
    postLogin,
    getSignup,
    getFailSignup,
    postSignup,
}
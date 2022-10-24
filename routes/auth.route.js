const authRoutes = require('../controllers/auth.functions')
const auth_router =  require('express').Router()

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Import passport & bcryptjs
const passport = require('passport')
require('../passport/auth')
require('../checkAuth')

//Auth Routes
auth_router.get('/login', authRoutes.getLogin)
auth_router.get('/signup', authRoutes.getSignup)
auth_router.post(
    '/login',
    passport.authenticate('login', {failureRedirect: 'fail-login'}),
    authRoutes.postLogin,
    (req, res) => { 
        const username = req.body.username
        res.send(username)
    }
)
auth_router.post(
    '/signup',
    upload.single('image'),
    passport.authenticate('signup', {failureRedirect: 'fail-signup'}),
    authRoutes.postSignup
)
auth_router.get('/fail-login', authRoutes.getFailLogin)
auth_router.get('/fail-signup', authRoutes.getFailSignup)

/*auth_router.get('/', checkAuth, (req, res) => {
    try {
        res.render('home', {username})
        const logger = log4js.getLogger('info');
        logger.info(`${req.method} ${req.url} READY`)
    } catch {
        const logger = log4js.getLogger('error');
        logger.error(`ERROR: ${req.method}: ${req.url} + ${error}`);
    }
})*/
module.exports = auth_router;
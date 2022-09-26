const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const compression = require('compression')
//Import dotenv
require('dotenv').config()
const yargs = require('yargs')(process.argv.slice[2])
// Import passport & bcryptjs
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require( 'bcryptjs' )
// Import socket.io
const http = require('http')
const { Server } = require('socket.io')
//Import hbs
const { engine } = require('express-handlebars')
//Import Routes
const authRoutes = require('./routes/auth.route')
const infoRoutes = require('./routes/info.route')
const randomRoutes = require('./routes/random.route')
//PORT
const argv = yargs
    .default({
        PORT: 8080
    })
    .alias({
        p: 'PORT'
    })
    .argv;
//Model
const Users = require('./models/userModel')
//Contenedores
const ProductsDB = require('./containers/containerProducts')
const productsDB =  new ProductsDB('products')
const MessagesDB = require('./containers/containerMessages')
const messagesDB =  new MessagesDB('./DB/messages.json')
//log4js
const log4js = require('log4js')

log4js.configure({
    appenders: {
        myLoggerConsole: {type: "console"},
        myLoggerFileWarn: {type: 'file', filename: './logs/warn.log'},
        myLoggerFileErr: {type: 'file', filename: './logs/error.log'}
    },
    categories: {
        default: {appenders: ['myLoggerConsole'], level: 'all'},
        info: {appenders: ['myLoggerConsole'], level: 'info'},
        warn: {appenders: ['myLoggerConsole', 'myLoggerFileWarn'], level: 'warn'},
        fileErr: {appenders: ['myLoggerConsole', 'myLoggerFileErr'], level: 'error'}
    }
})
//App
const app = express()
const httpServer = http.createServer(app)
//Socket
const io = new Server(httpServer)
//Settings
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
}))
app.set('view engine', 'hbs')
app.set('views', './views')
//Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 30000,
        secure: false,
        httpOnly: true
    }
}))
//Login
passport.use('login', new localStrategy(
    async (username, password, done) => {
        const user = await Users.findOne( { username } )      

        if(!user) console.log('User not found')
        
        const validPassword = bcrypt.compare( password, user.password )

        if (!validPassword) return done( null, false )

        return done(null, user)       
    }
))
//Sing Up
passport.use('signup', new localStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {

        const user = await Users.findOne( {username} )
        if (user) return done (null, false)    

        const newUser = { username, password, name: req.body.name }
        const salt = 10
        bcrypt.hash( newUser.password, salt )

        await Users.create(newUser, (err, userWithID) => {
            if(err) return done(err)
            return done(null, userWithID)
        })
    },
))
// Serialize user
passport.serializeUser((user, done) => {
    done(null, user._id)
})
//Deserialize User
passport.deserializeUser((id, done) => {
    Users.findById(id, done)
})
// Init passport
app.use(passport.initialize())
app.use(passport.session())
// Routes
app.use('/info', infoRoutes)
app.use('/api/randoms', randomRoutes)
//Auth Routes
app.get('/', authRoutes.getRoot)
app.get('/login', authRoutes.getLogin)
app.get('/signup', authRoutes.getSignup)
app.post(
    '/login',
    passport.authenticate('login', {failureRedirect: 'fail-login'}),
    authRoutes.postLogin,
    (req, res) => { 
        const username = req.body.username
        res.send(username)
    }
)
app.post(
    '/signup', 
    passport.authenticate('signup', {failureRedirect: 'fail-signup'}),
    authRoutes.postSignup
)
app.get('/fail-login', authRoutes.getFailLogin)
app.get('/fail-signup', authRoutes.getFailSignup)

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
}

app.get('/home', checkAuth, async (req, res) => {
    try {
        res.render('home', {username})
        const logger = log4js.getLogger('info');
        logger.info(`${req.method} ${req.url} OK`)
    } catch {
        const logger = log4js.getLogger('error');
        logger.error(`ERROR: ${req.method}: ${req.url} + ${error}`);
    }
})
app.get('/products', checkAuth, async (req, res) => {
    res.render('products', {
        products: await productsDB.getAll(),
        listExist: false
    })
})
app.get('/messages', checkAuth, async (req, res) => {
    res.render('chat', {
        messages: await messagesDB.getAll()
    })
    console.log(messagesDB)
})
app.get('/logout', checkAuth, (req, res) => {
    const username = req.session.username
    req.session.destroy()

    return res.render('logout', {username})
})

app.get('/fail', (req, res) => {
    const logger = log4js.getLogger('warn');
    logger.warn(`Error 404: ${req.method} ${req.url}`)
    res.status(404).send("ERROR: PAGE NOT FOUND.")
});
// io
io.on('connection', socket => {
    console.log('Usuario conectado, ID: ' + socket.id);

    socket.on('add', async data => {
        const dataOut = {
            name: data.name,
            category: data.category,
            price: data.price,
            img: data.img
        }
        productsDB.insert(dataOut)
        const products = await productsDB.getAll()
        console.log(products)
        io.sockets.emit('show', products)
    })
    socket.on('chat-in', async msg => {
        await messagesDB.insert(msg)
        .then(() => io.sockets.emit('chat-out', 'Added') )
        
    })
});

// Connect
function connectDB(url, cb) {
    mongoose.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        err => {
            if(!err) console.log('Connected DB')
            else if(cb != null) cb(err)
        }
    )
}

connectDB('mongodb://localhost:27017/app', err => {
    if(err) return console.log('Error connecting DB')
})

const server = httpServer.listen(argv.PORT, () => { console.log( `Server listening on port ${argv.PORT}`) })
server.on('error', e => console.log( "Error on server", e ))
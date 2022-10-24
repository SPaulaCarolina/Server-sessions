//---------------------------LIBRARIES-------------------------------------
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const compression = require('compression')
const path = require('path')
const uploadFile = require('express-fileUpload')

const {logger, loggerWarn, loggerErr} = require('./options/log4js')
require('dotenv').config()
// Import socket.io
const http = require('http')
const { Server } = require('socket.io')

//------------------------------ HBS -------------------------------------
const { engine } = require('express-handlebars')
//------------------------------ TWILIO ----------------------------------
/* const accountSID = process.env.TWILIO_ACCOUNT_SID
const authTOKEN = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSID, authTOKEN)

client.messages.create({
	from:'whatsapp:+14155238886',
	to:'whatsapp:+5491168287951',
	body: 'Hi, I am ready' 
})
.then(message=> console.log(message) )
.catch(e => console.log(e))
*/
//------------------------------ APP -------------------------------------
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)
//const messagesIO = require('./io/sockets')
const MessagesDB = require('./containers/containerMessages')
const messagesDB =  new MessagesDB('./DB/messages.json') 
const ProductsDB = require('./containers/containerProducts')
const cartDB =  new ProductsDB('cart')
//io.on('connection', messagesIO)
    //console.log('Usuario conectado, ID: ' + socket.id);
//---------------------------- Settings ----------------------------------
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/images/profiles', express.static(__dirname + '/public/uploads'))
//------------------------ SESSIONS -----------------------------
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 1200000,
        secure: false,
        httpOnly: true
    }
}))
//-------------------------- Passport Init -------------------------------
app.use(passport.initialize())
app.use(passport.session())
require('./passport/auth')
const authRoutes = require('./controllers/auth.functions')
const authRouter = require('./routes/auth.route')
const homeRouter = require('./routes/home.route')
const productRouter = require('./routes/products.route')
const cartRouter = require('./routes/cart.route')
const msgRouter = require('./routes/msg.route')
//------------------------ Config Handlebars -----------------------------
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
}))
app.set('view engine', 'hbs')
app.set('views', './views')
// Routes
app.get('/', authRoutes.getRoot)
app.use('/auth', authRouter)
app.use('/home', homeRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/messages', msgRouter)

io.on('connection', socket => {
    console.log('Usuario conectado, ID: ' + socket.id);

    socket.on('add', async data => {
        const dataOut = {
            name: data.name,
            category: data.category,
            price: data.price,
            img: data.img
        }
        cartDB.insert(dataOut)
        const products = await cartDB.getAll()
        console.log(products)
        io.sockets.emit('show', products)
    })
    socket.on('chat-in', async msg => {
        await messagesDB.insert(msg)
        .then(() => io.sockets.emit('chat-out', 'Added') )
        
    })
}); 

module.exports = httpServer;
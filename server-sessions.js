const MongoStore = require('connect-mongo')
const express = require('express')
const session = require('express-session')
const http = require('http')
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
//const path = require('path');

const PORT = process.env.PORT || 8080;
//Contenedores
const ProductsDB = require('./containers/containerProducts')
const productsDB =  new ProductsDB('products')
const MessagesDB = require('./containers/containerMessages')
//const file = path.join(__dirname + );
const messagesDB =  new MessagesDB('./DB/messages.json')


//APP
const app = express()
const httpServer = http.createServer(app);
// Socket
const io = new Server(httpServer)
//Settings
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(__dirname + '/public'))
//Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
}))
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost/sessions'
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.get('/login', (req, res) => {
    if(req.session.username) return res.redirect('/home')

    res.render('login')
})
app.post('/login', (req, res) => {
    req.session.username = req.body.username
    
    return res.redirect('/home')
})
app.get('/home', (req, res) => {
    console.log(req.session)
    console.log(req.session.username)
    if(!req.session.username) return res.redirect('/login')

    return res.render('home', {username: req.session.username})
})
app.get('/products', async (req, res) => {
    res.render('products', {
        products: await productsDB.getAll(),
        listExist: false
    })
})
app.get('/messages', async (req, res) => {
    res.render('chat', {
        messages: await messagesDB.getAll()
    })
    console.log(messagesDB)
})
app.get('/logout', (req, res) => {
    const username = req.session.username
    req.session.destroy()

    return res.render('logout', {username})
})

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

const server = httpServer.listen(PORT, () => { console.log( "Server listening..." ) })
server.on('error', e => console.log( "Error on server", e ))
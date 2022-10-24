// Import passport & bcryptjs
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require( 'bcryptjs' )
// Model Users
const Users = require('../models/user.model')
//Nodemailer
const sendEmail = require('../options/nodemailer')
// Serialize user
passport.serializeUser((user, done) => {
    done(null, user)
})
//Deserialize User
passport.deserializeUser((user, done) => {
    done(null, user)
})
//Login
passport.use('login', new localStrategy(
    async (email, password, done) => {
        const user = await Users.findOne( { email } )      

        if(!user) {
            return done(null, false)
        }
        const validPassword = bcrypt.compareSync( password, user.password )

        if (!validPassword) {
            return done( null, false )
        }

        return done(null, user)       
    }
))
//Sing Up
passport.use('signup', new localStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {

        const user = await Users.findOne( {username: req.body.email} )
        if (user) {
            return done (null, false)    
        }
        const newUser = req.body
        
        const img = req.file;
        newUser.img = img;
        
        sendEmail(newUser)

        const salt = 10
        newUser.password = bcrypt.hashSync( newUser.password, salt )

        await Users.create(newUser, (err, userWithID) => {
            if(err) return done(err)
            
            return done(null, userWithID)
        })
    }
))
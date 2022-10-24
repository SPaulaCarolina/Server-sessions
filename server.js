//---------------------------LIBRARIES-------------------------------------
require('dotenv').config()
const mongoose = require('mongoose')
//-----------------------------MODULES-------------------------------------
const httpServer = require('./app')
const {logger, loggerErr} = require('./options/log4js')
//------------------------------CONFIG-------------------------------------
const PORT = process.env.PORT || 8080
const mongoURL = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_LOCAL;
//----------------------------Connect DB-----------------------------------
async function connectServer() {
    try {
        mongoose.connect(mongoURL)
            .then( () => logger.info(`Connection to database: ${mongoURL}`) )
            .catch( (e) => loggerErr.error(e) );

        //----------------------------Server listening------------------------------
        const server = httpServer.listen(PORT, () => { 
            logger.info( `Server listening on port ${PORT}`) 
        })
        server.on('error', e => loggerErr.error( "Error on server", e ))
    } catch (e) {
        loggerErr.error( "Error trying to connect with server")
    }
}

connectServer()
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
        err: {appenders: ['myLoggerConsole', 'myLoggerFileErr'], level: 'error'}
    }
})

const logger = log4js.getLogger('info')
const loggerWarn = log4js.getLogger('warn')
const loggerErr = log4js.getLogger('err')

module.exports = {
    logger,
    loggerWarn,
    loggerErr
}


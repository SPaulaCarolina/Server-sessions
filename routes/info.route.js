const info_router =  require('express').Router()
const { fork } = require('child_process')

info_router.get('/', (req, res) => {
    res.json({
        "Argumentos de entrada": process.argv,
        "Nombre de la plataforma": process.platform,
        "Versión de node": process.version,
        "Memoria total reservada": process.memoryUsage().rss,
        "Path de ejecución": process.execPath,
        "Process ID": process.pid,
        "Carpeta del proyecto": process.cwd()
    })
})

module.exports = info_router;

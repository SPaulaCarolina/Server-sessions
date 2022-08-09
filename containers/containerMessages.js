const fs = require('fs').promises
const { normalize, schema } = require('normalizr')

const author = new schema.Entity('author')
const msg = new schema.Entity('msg', {
    author: author
})
const msgList = [msg]

class MessagesDB {
    constructor (file) {
        this.file = file
        this.data = []
        try {
            this.read()
            console.log('Data obtenida')
        } catch (e) {
            console.log('Error')
            this.write()
        }
    }
    async read() {
        this.data = JSON.parse(await fs.readFile(this.file))
        console.log(this.data)
    }
    async write() {
        await fs.writeFile(this.file, JSON.stringify(this.data))
    }
    async getAll() {
        return this.data
        //JSON.parse(await fs.readFile(this.file, 'utf-8'))
    }
    async insert(msg) {
        const id = this.data.length
        this.data.push({...msg, ...{ id: id + 1}})  

        const normalizedData = normalize(this.data, msgList, this.data.entities)
        await fs.writeFile(this.file, JSON.stringify(normalizedData, null, '\t'));
    }
    async normalize() {
        this.data = JSON.parse(await fs.readFile(this.file, 'utf-8'))
        
    }
}
module.exports = MessagesDB;
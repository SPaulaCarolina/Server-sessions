const fs = require('fs').promises
const { normalize, schema } = require('normalizr')
const messages = ('./DB/messages.json')

const author = new schema.Entity('author')
const msg = new schema.Entity('msg', {
    author: author
})


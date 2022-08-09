const options = require('../options/db')
const knex = require('knex')(options)
class ProductsDB {
    constructor(db) { 
        this.knex = knex;
        this.db = db;
        this.data = []
        
        try {
            this.write()
        } catch(e) {
            console.log(e)     
            this.read()    
        }
    }
    async read() {
        this.data = await this.knex.from(this.db).select('*')
        .then(() => console.log('read db'))
        .catch( err => console.log(err))
    }
    async write() {
        await this.knex.schema.createTable(this.db, table => {
            table.increments('id')
            table.string('name')
            table.string('category')
            table.integer('price')                
            table.string('img')
        })  
        .then(() => console.log('write db'))
        .catch( err => console.log(err))
    }  
    async insert(obj) {
        return await this.knex(this.db).insert(obj)
        .then(() => console.log('Producto Agregado') )
        .catch( err => console.log(err))
    }
    async getAll() {
        return this.knex.from(this.db).select('*')
    } 
    async getByID(id) {
        return await this.knex(this.db).select([id])
    }
    async editByID( obj, id ){
        return await knex.from(this.db)
        .where( 'id', '=', id )
        .update(obj)
        .then( () => console.log('Data updated') )
        .catch( err => console.log(err) )
    }
    async deleteByID(id) {
        return await knex.from(this.db)
        .where('id', '=', id)
        .del()
        .then( () => console.log('Data deleted'))
        .catch( err => console.log(err))  
    }
    async deleteAll() {
        return await this.knex.from(this.db).del()
        .then( () => console.log('Data deleted'))
        .catch( err => console.log(err))
    }
}

module.exports = ProductsDB;

let mongoose = require('mongoose');
const { mongoURL, database } = require('../helpers/config');

const server = mongoURL;
const DBName = database;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        console.log(server + " " + DBName)
        mongoose
            .connect(`mongodb://${server}/${DBName}`)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection error');
            });
    }
}

module.exports = new Database();
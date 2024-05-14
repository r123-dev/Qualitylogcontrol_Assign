const { MongoClient } = require('mongodb');
const config = require('../../config/config.json');
require('dotenv').config();
let db;

async function connectDB() {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    db = client.db(config.db_name);
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return db;
}

module.exports = { connectDB, getDB };

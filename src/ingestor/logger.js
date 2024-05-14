const fs = require('fs');
const path = require('path');
const config = require('../../config/config.json');
const { getDB } = require('./db');

async function writeLog(apiName, level, logString) {
    const logEntry = {
        level: level,
        log_string: logString,
        timestamp: new Date().toISOString(),
        metadata: {
            source: config.log_files[apiName]
        }
    };

    const logFile = config.log_files[apiName];
    fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error(`Failed to write log to ${logFile}`, err);
        }
    });

    const db = getDB();
    await db.collection(config.collection_name).insertOne(logEntry);
}

module.exports = { writeLog };


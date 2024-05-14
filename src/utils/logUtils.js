const fs = require('fs');
const path = require('path');
const { getDB } = require('../ingestor/db');


function loadLogsFromFile(logFiles) {
    let logs = [];
    logFiles.forEach((file) => {
        const filePath = path.join(__dirname, '../../', file);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            data.split('\n').forEach((line) => {
                if (line) {
                    logs.push(JSON.parse(line));
                }
            });
        }
    });
    return logs;
}


async function loadLogsFromDB(query) {
    const db = getDB();
    const logs = await db.collection('logs').find(query).toArray();
    return logs;
}

function filterLogs(logs, level, logString, startTime, endTime, source) {
    return logs.filter(log => {
        if (level && log.level !== level) return false;
        if (logString && !log.log_string.includes(logString)) return false;
        if (startTime && new Date(log.timestamp) < new Date(startTime)) return false;
        if (endTime && new Date(log.timestamp) > new Date(endTime)) return false;
        if (source && log.metadata.source !== source) return false;
        return true;
    });
}

module.exports = { loadLogsFromFile, loadLogsFromDB, filterLogs };


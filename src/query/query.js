const { program } = require('commander');
const { connectDB, getDB } = require('../ingestor/db');
const { loadLogsFromFile, loadLogsFromDB, filterLogs } = require('../utils/logUtils');
const config = require('../../config/config.json');

async function queryLogs(level, logString, startTime, endTime, source) {
    let logs = [];


    const logFiles = Object.values(config.log_files);
    logs = loadLogsFromFile(logFiles);

    const dbQuery = {};
    if (level) dbQuery.level = level;
    if (logString) dbQuery.log_string = { $regex: logString, $options: 'i' };
    if (startTime) dbQuery.timestamp = { $gte: new Date(startTime).toISOString() };
    if (endTime) {
        dbQuery.timestamp = dbQuery.timestamp || {};
        dbQuery.timestamp.$lte = new Date(endTime).toISOString();
    }
    if (source) dbQuery['metadata.source'] = source;

    // Load logs from MongoDB
    const dbLogs = await loadLogsFromDB(dbQuery);
    logs = logs.concat(dbLogs);

    // Filter logs
    return filterLogs(logs, level, logString, startTime, endTime, source);
}

program
    .option('--level <level>', 'Log level to filter by')
    .option('--log_string <logString>', 'Log message content to filter by')
    .option('--start_time <startTime>', 'Start time for logs (ISO 8601)')
    .option('--end_time <endTime>', 'End time for logs (ISO 8601)')
    .option('--source <source>', 'Source file of the logs');

program.parse(process.argv);

const options = program.opts();

connectDB().then(async () => {
    const logs = await queryLogs(options.level, options.log_string, options.start_time, options.end_time, options.source);
    logs.forEach(log => {
        console.log(JSON.stringify(log, null, 2));
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
});


const express = require('express');
const { writeLog } = require('./logger');
const { connectDB } = require('./db');

const app = express();
app.use(express.json());

app.post('/api1', async (req, res) => {
    await writeLog('api1', 'info', 'Received data at API 1');
    res.json({ status: 'success' });
});

app.post('/api2', async (req, res) => {
    await writeLog('api2', 'error', 'Error processing data at API 2');
    res.json({ status: 'error' });
});



const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
});

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000", // React app's address
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const os = require('os');
const fs = require('fs'); // Import fs for logging

app.use(cors());

// Simulate real-time metrics
function generateMetrics() {
    return {
        cpu: Math.random() * 100,
        memory: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
        apiLatency: Math.random() * 1000,
        diskUsage: Math.random() * 100, // Added disk usage
        networkUsage: Math.random() * 100, // Added network usage
        temperature: Math.random() * 100 // Added temperature
    };
}

// Alert thresholds
const ALERT_THRESHOLDS = {
    cpu: 80,
    memory: 80,
    apiLatency: 500,
    diskUsage: 90,
    networkUsage: 80,
    temperature: 75
};

// Log metrics to a file
function logMetrics(metrics) {
    const logEntry = `${new Date().toISOString()} - Metrics: ${JSON.stringify(metrics)}\n`;
    fs.appendFile('metrics.log', logEntry, (err) => {
        if (err) console.error('Error writing to log file', err);
    });
    return logEntry; // Return log entry for emitting to client
}

io.on('connection', (socket) => {
    console.log('A client connected');

    const interval = setInterval(() => {
        const metrics = generateMetrics();
        socket.emit('metrics', metrics);
        
        // Log metrics and emit to client
        const logEntry = logMetrics(metrics);
        socket.emit('log', logEntry); // Emit log entry to client

        // Check for alerts
        for (const [key, value] of Object.entries(metrics)) {
            if (value > ALERT_THRESHOLDS[key]) {
                socket.emit('alert', { type: key, value }); // Send alert to client
            }
        }
    }, 2000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

const PORT = 3002;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

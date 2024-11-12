import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Draggable from 'react-draggable'; // Import Draggable

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [metricsData, setMetricsData] = useState({
    cpu: [],
    memory: [],
    apiLatency: [],
    diskUsage: [],
    networkUsage: [],
    temperature: []
  });

  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]); // New state for logs
  const [showAlert, setShowAlert] = useState(true); // State to control alert visibility

  useEffect(() => {
    const socket = io('http://localhost:3002');
    
    socket.on('metrics', (data) => {
      setMetricsData(prev => ({
        cpu: [...prev.cpu, data.cpu].slice(-10), // Keep only the last 10 data points
        memory: [...prev.memory, data.memory].slice(-10),
        apiLatency: [...prev.apiLatency, data.apiLatency].slice(-10),
        diskUsage: [...prev.diskUsage, data.diskUsage].slice(-10),
        networkUsage: [...prev.networkUsage, data.networkUsage].slice(-10),
        temperature: [...prev.temperature, data.temperature].slice(-10)
      }));
    });

    socket.on('alert', (alert) => {
      setAlerts(prevAlerts => [...prevAlerts, alert]);
    });

    socket.on('log', (log) => {
      setLogs(prevLogs => [...prevLogs, log]); // Add new log to state
    });

    return () => socket.disconnect();
  }, []);

  const chartData = (dataset, label, color) => {
    const labels = dataset.map((_, index) => index + 1); // Generate labels based on the number of data points
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataset,
          borderColor: color,
          backgroundColor: color,
          tension: 0.4
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true, // Maintain aspect ratio
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'System Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 100%', textAlign: 'center' }}>
        <h1>System Monitoring Dashboard</h1>
      </div>
      <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Chart components */}
        {['cpu', 'memory', 'apiLatency', 'diskUsage', 'networkUsage', 'temperature'].map((metric, index) => (
          <div key={metric} style={{ flex: '1 1 30%', minWidth: '300px', margin: '10px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h2>{metric.charAt(0).toUpperCase() + metric.slice(1)} Usage</h2>
            {metricsData[metric].length > 0 && (
              <Line 
                data={chartData(metricsData[metric], metric.charAt(0).toUpperCase() + metric.slice(1), 'rgb(75, 192, 192)')} 
                options={options} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Scrollable Log Section */}
      <div style={{ marginTop: '20px', maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9', flex: '1 1 100%' }}>
        <h2>Logs</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      {/* Side Alert Notification */}
      {showAlert && alerts.length > 0 && (
        <Draggable handle=".handle">
          <div style={{
            position: 'fixed',
            right: '20px',
            top: '20px',
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
            transition: 'transform 0.2s ease', // Smooth transition for dragging
            opacity: alerts.length > 0 ? 1 : 0,
            maxHeight: '300px', // Set a maximum height for the alert section
            overflowY: 'auto' // Enable vertical scrolling
          }}>
            <div className="handle" style={{ cursor: 'move', padding: '5px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '5px', marginBottom: '5px' }}>
              Drag Me
            </div>
            <h2>Alerts</h2>
            <button onClick={() => setShowAlert(false)} style={{ marginBottom: '10px', backgroundColor: 'white', color: 'red', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {alerts.map((alert, index) => (
                <li key={index}>{alert.type} exceeded threshold: {alert.value}</li>
              ))}
            </ul>
            <button onClick={() => setShowAlert(true)} style={{ marginTop: '10px', backgroundColor: 'white', color: 'red', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Show Alerts</button>
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default App;

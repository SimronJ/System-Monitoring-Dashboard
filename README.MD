# System Monitoring Dashboard

## Overview
The System Monitoring Dashboard is a real-time application designed to monitor various system metrics such as CPU usage, memory usage, API latency, disk usage, network usage, and temperature. It provides a visual representation of these metrics using charts and allows users to view logs and alerts for any anomalies detected in the system.

## Demo Video
![Alt Text](https://github.com/SimronJ/System-Monitoring-Dashboard/blob/master/DEMO_SHOWCHASE.gif)

## Tech Stack
- **Frontend**: 
  - React.js: A JavaScript library for building user interfaces.
  - Chart.js: A library for creating charts and visualizations.
  - Socket.io: A library for real-time web applications, enabling bidirectional communication between the client and server.
  - Draggable: A library for making elements draggable in the UI.

- **Backend**:
  - Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
  - Express.js: A web application framework for Node.js.
  - Socket.io: Used on the server-side for real-time communication.
  - OS and FS modules: Built-in Node.js modules for accessing operating system information and file system operations.

## How to Use
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   - Navigate to the backend directory and install the required packages:
     ```bash
     cd backend
     npm install
     ```
   - Navigate to the frontend directory and install the required packages:
     ```bash
     cd frontend
     npm install
     ```

3. **Run the Backend Server**:
   - Start the backend server:
     ```bash
     node server.js
     ```
   - The server will run on `http://localhost:3002`.

4. **Run the Frontend Application**:
   - Start the frontend application:
     ```bash
     cd frontend
     npm start
     ```
   - The application will be accessible at `http://localhost:3000`.

5. **View the Dashboard**:
   - Open your web browser and navigate to `http://localhost:3000` to view the System Monitoring Dashboard.

## Connection to Real Application
The dashboard connects to a backend server that simulates real-time metrics using random data generation. The server emits metrics, logs, and alerts to the frontend using Socket.io, allowing users to see live updates on system performance. The application is designed to help users monitor their systems effectively and respond to any alerts regarding performance thresholds.

## Features
- Real-time monitoring of system metrics.
- Visual representation of metrics using charts.
- Scrollable log section to view historical logs.
- Alert notifications for metrics exceeding predefined thresholds.
- Draggable alert notification for better user experience.

## Challenges Encountered
While working on this project, several challenges were encountered:

1. **Real-time Data Handling**: Implementing real-time data updates using Socket.io required careful management of state in the React application. Ensuring that the UI updated smoothly without performance issues was a key challenge.

2. **Chart Integration**: Integrating Chart.js with dynamic data from the backend posed difficulties, particularly in ensuring that the charts updated correctly as new data arrived. Managing the chart's state and re-rendering efficiently was crucial.

3. **Alert Management**: Designing a system to handle alerts effectively was challenging. It required setting appropriate thresholds and ensuring that alerts were displayed in a user-friendly manner without overwhelming the user.

4. **Logging Mechanism**: Implementing a logging mechanism that not only stored logs in a file but also emitted them to the frontend in real-time required careful consideration of performance and data integrity.

5. **User Experience**: Creating a seamless user experience, especially with draggable elements and responsive design, required extensive testing and iteration to ensure that the application was intuitive and easy to use.

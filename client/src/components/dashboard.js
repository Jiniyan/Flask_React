import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css'; // Import the CSS file
function Dashboard() {
  const [data, setData] = useState({
    total_tests: 0,
    active_simulations: 0,
    errors_detected: 0,
    simulation_controls: {
      frequency: 50,
      amplitude: 5,
    },
    test_logs: [],
  });

  const [testRange, setTestRange] = useState('daily');
  const [errorRange, setErrorRange] = useState('daily');

  const handleFrequencyChange = (event) => {
    setData({
      ...data,
      simulation_controls: {
        ...data.simulation_controls,
        frequency: event.target.value,
      },
    });
  };

  const handleAmplitudeChange = (event) => {
    setData({
      ...data,
      simulation_controls: {
        ...data.simulation_controls,
        amplitude: event.target.value,
      },
    });
  };

  const updateControls = () => {
    const frequency = `${data.simulation_controls.frequency}Hz`;
    const amplitude = `${data.simulation_controls.amplitude}V`;

    fetch('/api/update_controls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frequency, amplitude }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Updated controls:', result);
      })
      .catch((error) => {
        console.error('Error updating controls:', error);
      });
  };

  const updateTests = () => {
    fetch(`/api/get_tests?range=${testRange}`)
      .then((response) => response.json())
      .then((result) => {
        setData((prevData) => ({
          ...prevData,
          total_tests: result.total_tests,
        }));
      })
      .catch((error) => {
        console.error('Error updating total tests:', error);
      });
  };

  const updateErrors = () => {
    fetch(`/api/get_tests?range=${errorRange}`)
      .then((response) => response.json())
      .then((result) => {
        setData((prevData) => ({
          ...prevData,
          errors_detected: result.total_tests, // Reuse API for demonstration
        }));
      })
      .catch((error) => {
        console.error('Error updating errors:', error);
      });
  };

  const startSimulation = () => {
    fetch('/api/start_simulation', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.status);
      })
      .catch((error) => {
        console.error('Error starting simulation:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="text-center">Battery Simulation Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card navy-blue">
            <div className="card-body">
              <h5 className="card-title">Total Tests</h5>
              <p className="card-text">{data.total_tests}</p>
              <select
                className="form-control"
                value={testRange}
                onChange={(e) => setTestRange(e.target.value)}
              >
                <option value="daily">Today</option>
                <option value="weekly">Last Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
              <button className="btn btn-light mt-2" onClick={updateTests}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card light-blue">
            <div className="card-body">
              <h5 className="card-title">Active Simulations</h5>
              <p className="card-text">{data.active_simulations}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card navy-blue">
            <div className="card-body">
              <h5 className="card-title">Errors Detected</h5>
              <p className="card-text">{data.errors_detected}</p>
              <select
                className="form-control"
                value={errorRange}
                onChange={(e) => setErrorRange(e.target.value)}
              >
                <option value="daily">Today</option>
                <option value="weekly">Last Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
              <button className="btn btn-light mt-2" onClick={updateErrors}>
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card navy-blue">
            <div className="card-body">
              <h5 className="card-title">Frequency</h5>
              <input
                type="range"
                min="10"
                max="100"
                value={data.simulation_controls.frequency}
                className="custom-range"
                onChange={handleFrequencyChange}
              />
              <p className="card-text">
                {data.simulation_controls.frequency}Hz
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card navy-blue">
            <div className="card-body">
              <h5 className="card-title">Amplitude</h5>
              <input
                type="range"
                min="1"
                max="10"
                value={data.simulation_controls.amplitude}
                className="custom-range"
                onChange={handleAmplitudeChange}
              />
              <p className="card-text">{data.simulation_controls.amplitude}V</p>
            </div>
          </div>
        </div>

        <div className="col-md-12 text-center">
          <button className="btn btn-light" onClick={updateControls}>
            Update Controls
          </button>
          <button className="btn btn-success" onClick={startSimulation}>
            Start Simulation
          </button>
          <a href="/testing_logs" className="btn btn-info mt-2">
            View Test Logs
          </a>
        </div>

        <div className="col-md-12">
          <div className="card navy-blue">
            <div className="card-body">
              <h5 className="card-title">Test Logs</h5>
              <ul className="list-group">
                {data.test_logs.map((log, index) => (
                  <li className="list-group-item" key={index}>
                    {log.date}: {log.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

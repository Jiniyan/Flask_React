from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data for the battery simulation dashboard
dashboard_data = {
    "total_tests": 200,
    "active_simulations": 5,
    "errors_detected": 3,
    "simulation_controls": {
        "frequency": "50Hz",
        "amplitude": "5V"
    },
    "test_logs": [
        {"date": datetime.now() - timedelta(days=1), "status": "Passed"},
        {"date": datetime.now() - timedelta(days=2), "status": "Failed - Error code: 101"},
        {"date": datetime.now() - timedelta(days=3), "status": "Passed"},
        {"date": datetime.now() - timedelta(days=4), "status": "In progress..."},
        {"date": datetime.now() - timedelta(days=5), "status": "Passed"},
    ],
}

@app.route('/')
def index():
    return render_template('dashboard.html', data=dashboard_data)

@app.route('/testing_logs')
def testing_logs():
    # Replace with actual log fetching logic
    logs = [
        {'date': '2024-10-18', 'status': 'Passed'},
        {'date': '2024-10-19', 'status': 'Failed'},
        # Add more log entries as needed
    ]
    return render_template('testing_logs.html', logs=logs)

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    return jsonify(dashboard_data)

@app.route('/api/update_controls', methods=['POST'])
def update_controls():
    global dashboard_data
    frequency = request.json.get('frequency')
    amplitude = request.json.get('amplitude')
    
    if frequency:
        dashboard_data['simulation_controls']['frequency'] = frequency
    if amplitude:
        dashboard_data['simulation_controls']['amplitude'] = amplitude
    
    return jsonify(dashboard_data['simulation_controls'])

@app.route('/api/get_tests', methods=['GET'])
def get_tests():
    date_range = request.args.get('range', default='daily')
    now = datetime.now()

    if date_range == 'daily':
        tests_count = sum(1 for log in dashboard_data['test_logs'] if log['date'].date() == now.date())
    elif date_range == 'weekly':
        tests_count = sum(1 for log in dashboard_data['test_logs'] if now - timedelta(days=7) <= log['date'] <= now)
    elif date_range == 'monthly':
        tests_count = sum(1 for log in dashboard_data['test_logs'] if log['date'].month == now.month and log['date'].year == now.year)
    elif date_range == 'yearly':
        tests_count = sum(1 for log in dashboard_data['test_logs'] if log['date'].year == now.year)
    else:
        tests_count = len(dashboard_data['test_logs'])

    return jsonify({"total_tests": tests_count})

@app.route('/api/start_simulation', methods=['POST'])
def start_simulation():
    # Here you would implement the logic to start the simulation.
    return jsonify({"status": "Simulation started"}), 200

if __name__ == '__main__':
    app.run(debug=True)

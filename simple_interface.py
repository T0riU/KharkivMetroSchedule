import json
from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)

# Global variables for file names
JSON_FILE_PATH = 'scraped_data_bu.json'  # Update with the correct file path
TEMPLATE_FILE = 'index.html'

# Function to read JSON data from a file
def load_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Load data from the x.json file
data = load_json_data(JSON_FILE_PATH)

# Function to get day type (0 for weekdays, 1 for weekends)
def get_day_type():
    today = datetime.today().weekday()
    if today < 5:
        return 0  # Weekdays
    else:
        return 1  # Weekends

# Function to process station names
def process_station_name(url):
    # Decode the URL and remove unwanted parts
    station = url.split('%C2%AB')[1].split('%C2%BB')[0]
    
    # Remove dashes and capitalize the first letter of each word
    station = station.replace('-', ' ').title()

    return station

# Function to process line names (trim after the word "Liniia", but keep "Liniia")
def process_line_name(line):
    # Split the line name at "Liniia", but keep "Liniia"
    if 'liniia' in line.lower():
        line = line.split('liniia')[0] + 'Liniia'
    
    # Capitalize the first letter of each word (but keep "Liniia" as it is)
    line = line.replace('-', ' ').title()

    return line

# Function to get current time in hh:mm:ss format
def get_current_time():
    return datetime.now().strftime('%H:%M:%S')

@app.route('/')
def index():
    day_type = get_day_type()
    
    # Extract keys for day types dynamically
    day_type_keys = list(data.keys())
    
    # Use the appropriate key based on the day_type (0 for weekdays, 1 for weekends)
    lines_data = data[day_type_keys[day_type]]
    
    # Process the line names and station names
    station_info = {}
    
    for line, stations in lines_data.items():
        # Process line name
        processed_line = process_line_name(line)
        
        # Process station names and add current time for each station
        station_info[processed_line] = [(process_station_name(station), get_current_time()) for station in stations]

    return render_template(TEMPLATE_FILE, station_info=station_info)

@app.route('/current-time')
def current_time():
    # Return the current time as JSON
    return jsonify(time=get_current_time())

if __name__ == '__main__':
    app.run(debug=True)

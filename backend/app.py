from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# Script specific
from init_db import init_db
from scripts.api_routes import routes_blueprint

#Initiate app variable and set routes defined elsewhere
app = Flask(__name__, static_folder='build', static_url_path='/')
app.register_blueprint(routes_blueprint)
CORS(app)

# Serve static files
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# Serve React app for all other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Initialize database on startup
    init_db()

    # Print all registered routes
    print('Printing out all API endpoints for reference')
    for rule in app.url_map.iter_rules():
        print(rule.endpoint, rule.rule, list(rule.methods))

    # Run the app
    port = int(os.environ.get('PORT', 5001))
    env = os.getenv('ENV', None)
    if(env == 'production'):
        print('Running in production mode')
        app.run(debug=False, host='0.0.0.0', port=port)
    elif(env == 'dev'):
        print('Running in development mode')
        app.run(debug=True, host='0.0.0.0', port=port)
    else:
        raise ValueError(f'ENV variable must be set to either "production" or "dev" - {env}')

# Climbing Score App

A web application for tracking climbing scores and progress for the Senders & Benders climbing group.

## Features

- **Climber Management**: Add and manage climbers with their contact information
- **Route Database**: Track climbing routes with grades, locations, and descriptions
- **Score Tracking**: Record attempts, sends, and notes for each climb
- **Dashboard**: View statistics and recent activity
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Python Flask with REST API
- **Database**: SQLite
- **Styling**: Custom CSS with responsive design

## Project Structure

```
sb-score-app/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   └── requirements.txt    # Python dependencies
├── start.sh                # Script to start both servers
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Python 3.8 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/sb-score-app
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Use the start script (recommended)
```bash
./start.sh
```
This will start both the frontend and backend servers simultaneously.

#### Option 2: Start servers manually

**Start the backend server:**
```bash
cd backend
python app.py
```
The backend will run on http://localhost:5000

**Start the frontend development server:**
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### Using the Application

1. **Dashboard**: View overall statistics and recent activity
2. **Climbers**: Add and manage climbers in your group
3. **Routes**: Add climbing routes with grades and locations
4. **Scores**: Record climbing attempts and sends

## API Endpoints

### Climbers
- `GET /api/climbers` - Get all climbers with scores
- `POST /api/climbers` - Add a new climber
- `DELETE /api/climbers/{id}` - Delete a climber

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Add a new route
- `DELETE /api/routes/{id}` - Delete a route

### Scores
- `GET /api/scores` - Get all scores with climber/route info
- `POST /api/scores` - Record a new score/attempt
- `DELETE /api/scores/{id}` - Delete a score

### Stats
- `GET /api/stats` - Get dashboard statistics

## Database Schema

### Climbers Table
- `id` (PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `date_created` (TIMESTAMP)

### Routes Table
- `id` (PRIMARY KEY)
- `name` (TEXT)
- `grade` (TEXT)
- `location` (TEXT)
- `description` (TEXT)
- `date_created` (TIMESTAMP)

### Scores Table
- `id` (PRIMARY KEY)
- `climber_id` (FOREIGN KEY)
- `route_id` (FOREIGN KEY)
- `completed` (BOOLEAN)
- `attempts` (INTEGER)
- `notes` (TEXT)
- `date_recorded` (TIMESTAMP)

## Development

### Adding New Features

1. **Frontend**: Add new components in `frontend/src/components/`
2. **Backend**: Add new API endpoints in `backend/app.py`
3. **Database**: Modify the `init_db()` function to add new tables

### Testing

The application includes basic error handling and validation. For production use, consider adding:
- Input validation and sanitization
- User authentication
- Automated tests
- Logging
- Environment-based configuration

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is for personal use by the Senders & Benders climbing group.

---

Happy climbing! 🧗‍♂️🧗‍♀️

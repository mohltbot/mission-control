# ArchTrack - Architectural Firm Dashboard

A professional employee monitoring and project management system designed specifically for architectural firms. Track employee productivity, manage projects, and generate comprehensive reports.

## Features

### Employee Desktop App
- **Time Tracking**: Start/stop timers for tasks with automatic time logging
- **Task Management**: View assigned tasks, mark as complete, add notes
- **Idle Detection**: Automatically detects when employee is idle (configurable threshold)
- **Project Assignment**: View and work on assigned projects
- **System Tray**: Minimize to tray for unobtrusive operation
- **Offline Support**: Works offline and syncs when connection is restored

### Admin Dashboard
- **Employee Overview**: Real-time view of all employees' status and activity
- **Project Management**: Create projects, assign tasks, track progress
- **Time Reports**: Detailed time tracking reports with filters
- **Analytics**: Productivity metrics, idle time analysis, project completion rates
- **Export**: PDF and CSV export for reports
- **Real-time Updates**: WebSocket-powered live updates

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **Operating Systems**: macOS 10.15+, Windows 10+, Linux

## Quick Start

### 1. Install Dependencies

```bash
# From the root directory
npm run install:all
```

Or manually:
```bash
# Install root dependencies
npm install

# Install desktop app dependencies
cd desktop-app
npm install
cd ..

# Install admin dashboard dependencies
cd admin-dashboard
npm install
cd ..
```

### 2. Start the Admin Dashboard

```bash
# Terminal 1 - Start the admin server and client
npm run dev:admin
```

The admin dashboard will be available at:
- **Web Interface**: http://localhost:5174
- **API Server**: http://localhost:3001

### 3. Start the Desktop App

```bash
# Terminal 2 - Start the desktop app
npm run dev:desktop
```

The desktop app will launch in Electron.

### 4. Login Credentials

**Admin Dashboard:**
- Email: `admin@archtrack.com`
- Password: `admin123`

**Test Employee Accounts:**
- Email: `sarah@archtrack.com` / Password: `password123`
- Email: `michael@archtrack.com` / Password: `password123`
- Email: `emily@archtrack.com` / Password: `password123`
- Email: `david@archtrack.com` / Password: `password123`

## Building for Production

### Admin Dashboard

```bash
cd admin-dashboard
npm run build
npm start
```

### Desktop App

```bash
cd desktop-app

# Build for current platform
npm run dist

# Build for macOS
npm run dist:mac

# Build for Windows
npm run dist:win
```

Installers will be created in the `desktop-app/dist-electron/` directory.

## Project Structure

```
arch-firm-dashboard/
├── desktop-app/          # Electron desktop application
│   ├── src/
│   │   ├── main/        # Electron main process
│   │   └── renderer/    # React frontend
│   ├── package.json
│   └── dist/            # Build output
├── admin-dashboard/      # Admin web dashboard
│   ├── src/
│   │   ├── client/      # React frontend
│   │   └── server/      # Node.js backend
│   ├── package.json
│   └── dist/            # Build output
├── shared/              # Shared types (copied to each project)
└── package.json         # Root package.json
```

## Configuration

### Desktop App

Configuration is stored in the app's user data directory:
- **macOS**: `~/Library/Application Support/ArchTrack/`
- **Windows**: `%APPDATA%/ArchTrack/`
- **Linux**: `~/.config/ArchTrack/`

Settings include:
- Server URL (default: http://localhost:3001)
- Idle detection threshold (default: 5 minutes)
- Screenshot settings
- Employee credentials

### Admin Dashboard

Environment variables (in `admin-dashboard/.env`):
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:5174
```

## Data Storage

### Desktop App
- Uses JSON file storage in user's data directory
- Stores tasks, projects, time entries locally
- Syncs with server when online

### Admin Dashboard
- Development: SQLite database (`data/archtrack.db`)
- Production: PostgreSQL (set `DATABASE_URL` environment variable)

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoints.

## Troubleshooting

### Desktop App Won't Start
1. Make sure Node.js 18+ is installed
2. Delete `node_modules` and run `npm install` again
3. Check that port 5173 is not in use

### Admin Dashboard Won't Start
1. Check that port 3001 is not in use
2. Verify `.env` file exists
3. Delete `data/archtrack.db` to reset database (will lose data)

### Build Errors
1. Make sure all dependencies are installed
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall

## Development

### Running in Development Mode

```bash
# Start both admin and desktop in development
npm run dev

# Or start individually:
npm run dev:admin   # Admin only
npm run dev:desktop # Desktop only
```

### Making Changes

1. Desktop app changes will hot-reload automatically
2. Admin dashboard client changes will hot-reload
3. Admin server changes require restart (or use `npm run dev:server` for watch mode)

## License

MIT License - See LICENSE file for details

## Support

For support, contact: support@archtrack.app
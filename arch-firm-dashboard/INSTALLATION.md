# ArchTrack - Installation & Setup Guide

## Overview

ArchTrack is a professional employee monitoring and project management system designed specifically for architectural firms. It consists of two main components:

1. **Desktop App** - Installed on employee computers for time tracking and task management
2. **Admin Dashboard** - Web-based interface for managers to view reports and manage projects

## System Requirements

### Desktop App
- **Windows**: Windows 10 or later (64-bit)
- **macOS**: macOS 10.15 (Catalina) or later
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB

### Admin Dashboard (Server)
- **Node.js**: 18.x or later
- **RAM**: 2GB minimum, 4GB recommended
- **Database**: SQLite (included) or PostgreSQL (production)

## Quick Start

### 1. Install Admin Dashboard (Server)

```bash
# Navigate to admin-dashboard directory
cd admin-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The admin dashboard will be available at `http://localhost:3000`

**Default Login:**
- Email: `admin@archtrack.com`
- Password: `admin123`

> ⚠️ **Important**: Change the default password immediately after first login!

### 2. Build Desktop App

```bash
# Navigate to desktop-app directory
cd desktop-app

# Install dependencies
npm install

# Build for production
npm run build

# Create installers
npm run dist
```

Installers will be created in the `dist-electron` folder:
- Windows: `.exe` and `.msi` files
- macOS: `.dmg` and `.zip` files

### 3. Install Desktop App on Employee Computers

1. Distribute the appropriate installer to each employee
2. Run the installer and follow the setup wizard
3. Launch ArchTrack from the desktop shortcut or Start Menu
4. Configure the server URL to point to your admin dashboard
5. Log in with employee credentials

## Detailed Setup

### Server Deployment (Production)

For production deployment, we recommend:

1. **Use PostgreSQL** instead of SQLite
2. **Set up a reverse proxy** (nginx) with SSL
3. **Configure firewall** rules
4. **Set up automated backups**

#### Docker Deployment (Optional)

```dockerfile
# Dockerfile for production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Desktop App Configuration

After installation, employees need to configure:

1. **Server URL**: The address of your admin dashboard (e.g., `https://archtrack.yourcompany.com`)
2. **Idle Threshold**: How long before being marked as idle (default: 5 minutes)
3. **Screenshot Settings**: Enable/disable and set interval (optional)

### Setting Up Employees

1. Log in to the Admin Dashboard
2. Go to **Employees** → **Add Employee**
3. Enter employee details and create login credentials
4. Share credentials with the employee
5. Employee logs into the Desktop App with these credentials

## Features

### Desktop App Features
- ✅ One-click time tracking
- ✅ Task assignment and management
- ✅ Automatic idle detection
- ✅ Screenshot capture (optional)
- ✅ Offline mode with sync
- ✅ System tray integration
- ✅ Daily/weekly statistics

### Admin Dashboard Features
- ✅ Real-time employee monitoring
- ✅ Project management
- ✅ Task assignment and tracking
- ✅ Comprehensive reporting
- ✅ CSV/PDF export
- ✅ Productivity analytics
- ✅ Role-based access control

## Troubleshooting

### Desktop App Won't Connect
1. Verify server URL is correct
2. Check firewall settings
3. Ensure server is running
4. Check network connectivity

### Time Not Recording
1. Check if timer was started
2. Verify idle detection settings
3. Check for app updates

### Reports Not Generating
1. Verify date range is valid
2. Check if data exists for selected period
3. Clear browser cache and retry

## Security Considerations

1. **Change default passwords** immediately
2. **Use HTTPS** in production
3. **Regular backups** of database
4. **Limit screenshot access** to authorized personnel
5. **Review and comply** with local labor laws regarding monitoring

## Support

For technical support:
- Email: support@archtrack.app
- Documentation: https://docs.archtrack.app
- GitHub Issues: https://github.com/yourcompany/archtrack/issues

## License

This software is licensed under the MIT License. See LICENSE file for details.

---

**ArchTrack** - Built with ❤️ for architectural firms

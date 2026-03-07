# ArchTrack - Project Summary

## 🎯 Project Overview

**ArchTrack** is a professional employee monitoring and project management dashboard specifically designed for architectural firms. This complete solution enables firm owners to track employee productivity, manage projects, and generate comprehensive reports.

## 📦 What's Included

### 1. Desktop Application (Employee Tracker)
- **Technology**: Electron + React + TypeScript
- **Features**:
  - One-click time tracking with start/stop timer
  - Task assignment and progress tracking
  - Automatic idle detection (configurable threshold)
  - Optional screenshot capture for accountability
  - Offline mode with automatic sync
  - System tray integration for unobtrusive operation
  - Daily and weekly productivity statistics
  - Settings for customization

### 2. Admin Dashboard (Web Application)
- **Technology**: Node.js + Express + React + TypeScript
- **Features**:
  - Real-time employee monitoring dashboard
  - Employee management (add, edit, delete)
  - Project creation and management
  - Task assignment and tracking
  - Comprehensive reporting system
  - CSV export for payroll integration
  - Productivity analytics and scoring
  - Role-based access control (Admin/Employee)

### 3. Documentation
- **README.md** - Project overview and quick start
- **INSTALLATION.md** - Detailed setup instructions
- **USER_GUIDE.md** - End-user documentation
- **API_DOCUMENTATION.md** - Complete API reference
- **PROJECT_STRUCTURE.md** - Codebase organization

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

#### 1. Clone and Setup
```bash
cd arch-firm-dashboard
```

#### 2. Install Admin Dashboard
```bash
cd admin-dashboard
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

Admin dashboard will be available at `http://localhost:3000`

**Default Login:**
- Email: `admin@archtrack.com`
- Password: `admin123`

#### 3. Install Desktop App
```bash
cd desktop-app
npm install
npm run dev
```

#### 4. Build for Production

**Desktop App:**
```bash
cd desktop-app
npm run build
npm run dist
# Installers will be in dist-electron/
```

**Admin Dashboard:**
```bash
cd admin-dashboard
npm run build
npm start
```

## 🏗️ Project Structure

```
arch-firm-dashboard/
├── desktop-app/          # Electron desktop application
│   ├── src/
│   │   ├── main/        # Electron main process (Node.js)
│   │   │   ├── index.ts           # App entry point
│   │   │   ├── database.ts        # SQLite database
│   │   │   ├── time-tracker.ts    # Time tracking logic
│   │   │   ├── idle-detector.ts   # Idle detection
│   │   │   ├── socket-client.ts   # Real-time sync
│   │   │   └── screenshot-manager.ts
│   │   └── renderer/    # React frontend
│   │       ├── App.tsx
│   │       ├── components/
│   │       │   ├── TimerPanel.tsx
│   │       │   ├── TasksPanel.tsx
│   │       │   ├── StatsPanel.tsx
│   │       │   └── SettingsPanel.tsx
│   │       └── components/ui/     # Reusable UI components
│   └── package.json
│
├── admin-dashboard/      # Admin web dashboard
│   ├── src/
│   │   ├── server/      # Node.js backend
│   │   │   ├── index.ts           # Server entry
│   │   │   ├── database.ts        # Sequelize models
│   │   │   ├── socket.ts          # WebSocket handlers
│   │   │   ├── routes/            # API routes
│   │   │   │   ├── auth.ts
│   │   │   │   ├── employees.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── tasks.ts
│   │   │   │   ├── time-entries.ts
│   │   │   │   └── reports.ts
│   │   │   └── middleware/
│   │   └── client/      # React frontend
│   │       ├── App.tsx
│   │       ├── contexts/
│   │       ├── components/
│   │       └── pages/
│   │       │   ├── DashboardPage.tsx
│   │       │   ├── EmployeesPage.tsx
│   │       │   ├── ProjectsPage.tsx
│   │       │   ├── TasksPage.tsx
│   │       │   └── ReportsPage.tsx
│   └── package.json
│
├── shared/              # Shared TypeScript types
│   └── types.ts
│
└── docs/               # Documentation
    ├── README.md
    ├── INSTALLATION.md
    ├── USER_GUIDE.md
    ├── API_DOCUMENTATION.md
    └── PROJECT_STRUCTURE.md
```

## ✨ Key Features

### For Employees (Desktop App)
- ✅ Simple one-click time tracking
- ✅ View assigned tasks and update progress
- ✅ See daily/weekly productivity stats
- ✅ Automatic idle detection
- ✅ Works offline, syncs when connected
- ✅ Minimize to system tray
- ✅ Professional, clean UI

### For Managers (Admin Dashboard)
- ✅ Real-time view of all employees
- ✅ See who's currently working
- ✅ Create and manage projects
- ✅ Assign tasks to employees
- ✅ Generate detailed time reports
- ✅ Export data for payroll
- ✅ Productivity scoring and analytics
- ✅ Role-based access control

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting on API endpoints
- Input validation with Zod
- Secure WebSocket connections

## 📊 Reports Available

1. **Time Report** - Detailed time entries by employee/project/date
2. **Project Report** - Project progress, completion rates, budgets
3. **Productivity Report** - Employee performance metrics and scores

All reports can be exported as CSV for further analysis or payroll processing.

## 🛠️ Technology Stack

### Desktop App
- **Electron** - Cross-platform desktop framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **SQLite** - Local database
- **Socket.io-client** - Real-time communication
- **Tailwind CSS** - Styling
- **better-sqlite3** - Database driver

### Admin Dashboard
- **Node.js** - Runtime
- **Express.js** - Web framework
- **React 18** - Frontend UI
- **TypeScript** - Type safety
- **Sequelize** - ORM
- **Socket.io** - Real-time communication
- **SQLite/PostgreSQL** - Database
- **Tailwind CSS** - Styling
- **JWT** - Authentication

## 📝 Configuration

### Desktop App Settings
- Server URL (point to admin dashboard)
- Idle detection threshold
- Screenshot settings
- Theme preferences
- Minimize to tray option

### Admin Dashboard Environment Variables
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=sqlite:./data/archtrack.db
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

## 🎨 UI/UX Design

- **Professional, clean interface** suitable for architectural firms
- **Dark/Light mode** support
- **Responsive design** for various screen sizes
- **Intuitive navigation** with clear visual hierarchy
- **Real-time updates** without page refresh
- **Consistent design language** across both applications

## 📈 Future Enhancements

Potential features for future versions:
- Mobile app for on-site time tracking
- Integration with popular project management tools (Asana, Trello)
- Advanced analytics with charts and graphs
- Automated payroll calculations
- Client portal for project updates
- Time-off request management
- Expense tracking

## 🤝 Support

For technical support or questions:
- Review the USER_GUIDE.md
- Check API_DOCUMENTATION.md for API details
- See INSTALLATION.md for setup help

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Built with ❤️ for architectural firms**

*This is a production-ready prototype. For deployment to a live environment, additional security hardening, testing, and infrastructure setup is recommended.*

# ArchTrack Project Structure

```
arch-firm-dashboard/
├── README.md                      # Main project documentation
├── INSTALLATION.md                # Installation and setup guide
├── USER_GUIDE.md                  # End-user documentation
├── LICENSE                        # MIT License
├── .gitignore                     # Git ignore rules
│
├── shared/                        # Shared types and utilities
│   └── types.ts                   # TypeScript interfaces
│
├── desktop-app/                   # Electron Desktop Application
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.main.json         # Main process TS config
│   ├── tsconfig.renderer.json     # Renderer process TS config
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.js          # PostCSS config
│   ├── index.html                 # Entry HTML
│   │
│   ├── src/
│   │   ├── main/                  # Electron main process
│   │   │   ├── index.ts           # Main entry point
│   │   │   ├── preload.ts         # Preload script
│   │   │   ├── database.ts        # SQLite database manager
│   │   │   ├── idle-detector.ts   # Idle detection service
│   │   │   ├── time-tracker.ts    # Time tracking logic
│   │   │   ├── socket-client.ts   # WebSocket client
│   │   │   ├── screenshot-manager.ts  # Screenshot capture
│   │   │   └── config.ts          # Configuration manager
│   │   │
│   │   ├── renderer/              # React frontend
│   │   │   ├── main.tsx           # React entry
│   │   │   ├── App.tsx            # Main app component
│   │   │   ├── index.css          # Global styles
│   │   │   │
│   │   │   ├── components/        # React components
│   │   │   │   ├── TimerPanel.tsx
│   │   │   │   ├── TasksPanel.tsx
│   │   │   │   ├── StatsPanel.tsx
│   │   │   │   ├── SettingsPanel.tsx
│   │   │   │   ├── IdleOverlay.tsx
│   │   │   │   └── ui/            # UI components
│   │   │   │       ├── button.tsx
│   │   │   │       ├── card.tsx
│   │   │   │       ├── badge.tsx
│   │   │   │       ├── progress.tsx
│   │   │   │       └── toaster.tsx
│   │   │   │
│   │   │   └── shared/            # Shared renderer utils
│   │   │
│   │   └── shared/                # Shared between main/renderer
│   │
│   └── assets/                    # Static assets (icons, images)
│
├── admin-dashboard/               # Admin Web Dashboard
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.server.json       # Server TS config
│   ├── tsconfig.client.json       # Client TS config
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.js          # PostCSS config
│   ├── index.html                 # Entry HTML
│   ├── .env.example               # Environment variables template
│   │
│   ├── src/
│   │   ├── server/                # Node.js backend
│   │   │   ├── index.ts           # Server entry point
│   │   │   ├── database.ts        # Sequelize models
│   │   │   ├── socket.ts          # WebSocket handlers
│   │   │   │
│   │   │   ├── routes/            # API routes
│   │   │   │   ├── auth.ts        # Authentication
│   │   │   │   ├── employees.ts   # Employee management
│   │   │   │   ├── projects.ts    # Project management
│   │   │   │   ├── tasks.ts       # Task management
│   │   │   │   ├── time-entries.ts # Time tracking
│   │   │   │   └── reports.ts     # Reporting
│   │   │   │
│   │   │   └── middleware/        # Express middleware
│   │   │       └── auth.ts        # JWT authentication
│   │   │
│   │   └── client/                # React frontend
│   │       ├── main.tsx           # React entry
│   │       ├── App.tsx            # Main app component
│   │       ├── index.css          # Global styles
│   │       │
│   │       ├── contexts/          # React contexts
│   │       │   └── AuthContext.tsx
│   │       │
│   │       ├── components/        # React components
│   │       │   └── Layout.tsx
│   │       │
│   │       └── pages/             # Page components
│   │           ├── LoginPage.tsx
│   │           ├── DashboardPage.tsx
│   │           ├── EmployeesPage.tsx
│   │           ├── ProjectsPage.tsx
│   │           ├── TasksPage.tsx
│   │           └── ReportsPage.tsx
│   │
│   └── data/                      # Database storage (SQLite)
│
└── docs/                          # Additional documentation
    ├── API.md                     # API documentation
    ├── DEPLOYMENT.md              # Deployment guide
    └── SECURITY.md                # Security guidelines
```

## Key Technologies

### Desktop App
- **Electron**: Cross-platform desktop framework
- **React**: UI library
- **TypeScript**: Type safety
- **SQLite**: Local data storage
- **Socket.io-client**: Real-time communication
- **Tailwind CSS**: Styling

### Admin Dashboard
- **Node.js**: Runtime
- **Express**: Web framework
- **React**: Frontend UI
- **TypeScript**: Type safety
- **Sequelize**: ORM
- **Socket.io**: Real-time communication
- **SQLite/PostgreSQL**: Database
- **Tailwind CSS**: Styling

## Data Flow

1. **Employee** starts timer in Desktop App
2. **Time entry** saved to local SQLite database
3. **WebSocket** sends update to Admin Dashboard
4. **Admin Dashboard** displays real-time activity
5. **Reports** can be generated from aggregated data

## Security

- JWT-based authentication
- Password hashing (bcrypt)
- CORS protection
- Rate limiting
- Input validation (Zod)

## Development Workflow

1. Make changes to source files
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Package desktop app with `npm run dist`
5. Deploy admin dashboard to server

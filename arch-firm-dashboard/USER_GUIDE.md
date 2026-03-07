# ArchTrack - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Desktop App Guide](#desktop-app-guide)
3. [Admin Dashboard Guide](#admin-dashboard-guide)
4. [FAQ](#faq)

---

## Getting Started

### For Employees

1. **Install the Desktop App**
   - Download the installer from your IT department
   - Run the installer and follow the prompts
   - Launch ArchTrack from your desktop

2. **First Time Setup**
   - Enter the Server URL (provided by your admin)
   - Log in with your credentials
   - Configure your preferences in Settings

3. **Daily Usage**
   - Start the timer when you begin working
   - Select the task you're working on
   - Stop the timer when you take breaks or finish

### For Administrators

1. **Access the Dashboard**
   - Open your web browser
   - Navigate to your ArchTrack server URL
   - Log in with admin credentials

2. **Initial Setup**
   - Add your employees
   - Create projects
   - Assign tasks to team members

---

## Desktop App Guide

### Time Tracking

#### Starting a Timer
1. Open ArchTrack from the system tray or desktop
2. Click the **Start Timer** button
3. Optionally select a task from the dropdown
4. The timer will begin counting

#### Stopping a Timer
1. Click the **Stop Timer** button
2. Add any notes about the work completed (optional)
3. The time entry is automatically saved

#### Using the System Tray
- Right-click the ArchTrack icon in the system tray
- Select **Start Timer** or **Stop Timer**
- View current timer status at a glance

### Task Management

#### Viewing Your Tasks
1. Click the **Tasks** tab in the sidebar
2. See all tasks assigned to you
3. Filter by status (To Do, In Progress, Review, Completed)

#### Updating Task Status
1. Click on a task to view details
2. Click the status icon to cycle through states:
   - Circle → In Progress
   - Clock → Review
   - Checkmark → Completed

#### Adding Notes
- Click on a task
- Add notes in the description field
- Notes are saved automatically

### Idle Detection

ArchTrack automatically detects when you're away from your computer:

- **Idle Threshold**: Set in Settings (default: 5 minutes)
- **Idle Notification**: A popup appears when you return
- **Idle Time**: Automatically subtracted from your work time

### Settings

Access settings by clicking the **Settings** tab:

| Setting | Description | Default |
|---------|-------------|---------|
| Server URL | Address of admin dashboard | http://localhost:3000 |
| Idle Threshold | Minutes before marked idle | 5 minutes |
| Screenshots | Enable automatic capture | Disabled |
| Screenshot Interval | Minutes between captures | 10 minutes |
| Minimize to Tray | Keep running in background | Enabled |
| Start on Login | Auto-start with computer | Disabled |

---

## Admin Dashboard Guide

### Dashboard Overview

The main dashboard provides at-a-glance information:

- **Total Employees**: Number of team members
- **Online Now**: Currently active employees
- **Today's Hours**: Total hours tracked today
- **Active Timers**: Employees currently working

### Managing Employees

#### Adding New Employees
1. Navigate to **Employees** → **Add Employee**
2. Fill in the required information:
   - Full Name
   - Email Address
   - Password (temporary)
   - Department
   - Role (Employee or Admin)
3. Click **Create Employee**
4. Share login credentials securely

#### Viewing Employee Activity
1. Click on an employee's name
2. View their:
   - Time entries
   - Task assignments
   - Productivity metrics
   - Recent activity

### Project Management

#### Creating a Project
1. Go to **Projects** → **New Project**
2. Enter project details:
   - Project Name
   - Client Name
   - Description
   - Start/End Dates
   - Budget (in hours)
   - Priority Level
3. Click **Create Project**

#### Tracking Project Progress
- View progress bars on the Projects page
- See completed vs. total tasks
- Monitor hours spent vs. budget

### Task Management

#### Creating Tasks
1. Navigate to **Tasks** → **New Task**
2. Fill in task details:
   - Title
   - Description
   - Project (optional)
   - Assignee
   - Priority
   - Due Date
   - Estimated Hours
3. Click **Create Task**

#### Bulk Actions
- Select multiple tasks using checkboxes
- Use bulk actions to:
  - Change status
  - Reassign to different employee
  - Update priority
  - Delete tasks

### Reports

#### Generating Reports
1. Go to **Reports**
2. Select report type:
   - **Time Report**: Detailed time entries
   - **Project Report**: Project summaries
   - **Productivity Report**: Employee performance
3. Set date range
4. Click **Generate Report**

#### Exporting Data
- Generate your report
- Click **Export CSV** button
- File downloads automatically
- Open in Excel or Google Sheets

#### Understanding Metrics

**Productivity Score**:
- Calculated as: `(Total Hours - Idle Time) / Total Hours × 100`
- 90-100%: Excellent
- 70-89%: Good
- 50-69%: Needs Improvement
- Below 50%: Review Required

**Billable Hours**:
- Total time minus idle time
- Represents actual productive work

---

## FAQ

### General Questions

**Q: Does ArchTrack work offline?**
A: The desktop app tracks time offline and syncs when reconnected. However, real-time features require an internet connection.

**Q: Is my data secure?**
A: Yes. All data is encrypted in transit and at rest. We use industry-standard security practices.

**Q: Can I use ArchTrack on multiple devices?**
A: The desktop app is designed for one installation per employee. The admin dashboard is accessible from any web browser.

### Desktop App

**Q: Why isn't my timer starting?**
A: Check that:
- You're logged in
- The app is connected to the server
- You have an active internet connection

**Q: How do I change my password?**
A: Contact your administrator to reset your password.

**Q: Can I edit time entries?**
A: Employees cannot edit time entries. Contact your administrator if you need to make corrections.

**Q: What happens if I forget to stop the timer?**
A: The timer automatically stops when:
- You mark yourself as idle
- Your computer goes to sleep
- You close the application

### Admin Dashboard

**Q: How do I reset an employee's password?**
A: Go to Employees → Click employee name → Edit → Update Password

**Q: Can I delete time entries?**
A: Yes, administrators can delete or edit any time entry from the Reports section.

**Q: How do I export data for payroll?**
A: Generate a Time Report for the pay period, then export as CSV for import into your payroll system.

**Q: What do the different priority levels mean?**
A:
- **Urgent**: Drop everything and work on this
- **High**: Complete as soon as possible
- **Medium**: Normal priority
- **Low**: Complete when convenient

### Troubleshooting

**Q: The desktop app says "Offline"**
A: Try these steps:
1. Check your internet connection
2. Verify the server URL in Settings
3. Restart the application
4. Contact your administrator

**Q: Reports are showing incorrect data**
A: Ensure:
- Date range is correct
- Employee filters are set properly
- Data has synced (may take a few minutes)

**Q: Screenshots aren't being captured**
A: Check that:
- Screenshots are enabled in Settings
- The interval is set correctly
- You have sufficient disk space
- Antivirus isn't blocking the feature

---

## Tips for Best Results

### For Employees
1. **Start your timer immediately** when beginning work
2. **Select the correct task** for accurate project tracking
3. **Stop the timer** during breaks
4. **Add notes** to time entries for context
5. **Check your stats** weekly to track productivity

### For Managers
1. **Review reports weekly** to identify trends
2. **Set realistic deadlines** based on time estimates
3. **Communicate with employees** whose productivity is low
4. **Use project budgets** to prevent overruns
5. **Export data monthly** for payroll processing

---

Need more help? Contact support@archtrack.app

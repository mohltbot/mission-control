# ArchTrack API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints (except `/auth/login` and `/auth/refresh`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "uuid-refresh-token",
  "employee": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee",
    "department": "Architecture",
    "avatar": null
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/logout
Logout and invalidate refresh token.

#### GET /auth/me
Get current user information.

---

### Employees

#### GET /employees
List all employees.

**Query Parameters:**
- `role` (optional): Filter by role
- `department` (optional): Filter by department

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "Architecture",
    "isActive": true,
    "lastActiveAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /employees
Create a new employee.

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "tempPassword123",
  "role": "employee",
  "department": "Design"
}
```

#### GET /employees/:id
Get employee details.

#### PUT /employees/:id
Update employee information.

#### DELETE /employees/:id
Delete an employee.

#### GET /employees/:id/stats
Get employee statistics.

**Response:**
```json
{
  "totalHours": 160.5,
  "totalIdleTime": 12.3,
  "tasksCompleted": 24,
  "tasksInProgress": 5,
  "productivityScore": 92,
  "projectBreakdown": [
    {
      "projectId": "uuid",
      "projectName": "Downtown Office",
      "hours": 45.5
    }
  ]
}
```

#### GET /employees/:id/activity
Get employee activity log.

---

### Projects

#### GET /projects
List all projects.

**Query Parameters:**
- `status` (optional): Filter by status

#### POST /projects
Create a new project.

**Request:**
```json
{
  "name": "New Office Building",
  "description": "5-story commercial building",
  "clientName": "ABC Corp",
  "status": "active",
  "priority": "high",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "budget": 1000
}
```

#### GET /projects/:id
Get project details.

#### PUT /projects/:id
Update project information.

#### DELETE /projects/:id
Delete a project.

#### GET /projects/:id/stats
Get project statistics.

**Response:**
```json
{
  "totalTasks": 25,
  "completedTasks": 18,
  "inProgressTasks": 5,
  "completionRate": 72,
  "totalEstimatedHours": 500,
  "totalActualHours": 485.5,
  "budgetUtilization": 48.5
}
```

---

### Tasks

#### GET /tasks
List all tasks.

**Query Parameters:**
- `projectId` (optional): Filter by project
- `assignedTo` (optional): Filter by assignee
- `status` (optional): Filter by status

#### POST /tasks
Create a new task.

**Request:**
```json
{
  "title": "Design floor plans",
  "description": "Create detailed floor plans for level 1-5",
  "projectId": "uuid",
  "assignedTo": "uuid",
  "priority": "high",
  "estimatedHours": 40,
  "dueDate": "2024-02-15"
}
```

#### GET /tasks/:id
Get task details.

#### PUT /tasks/:id
Update task information.

#### DELETE /tasks/:id
Delete a task.

#### POST /tasks/bulk-update
Update multiple tasks at once.

**Request:**
```json
{
  "taskIds": ["uuid1", "uuid2"],
  "updates": {
    "status": "completed",
    "priority": "low"
  }
}
```

---

### Time Entries

#### GET /time-entries
List all time entries.

**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `projectId` (optional): Filter by project
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

#### POST /time-entries
Create a manual time entry.

**Request:**
```json
{
  "employeeId": "uuid",
  "taskId": "uuid",
  "projectId": "uuid",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "notes": "Worked on floor plans"
}
```

#### GET /time-entries/:id
Get time entry details.

#### PUT /time-entries/:id
Update time entry.

#### DELETE /time-entries/:id
Delete a time entry.

#### GET /time-entries/stats/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "todayHours": 56.5,
  "weekHours": 284.0,
  "activeTimers": 8,
  "totalIdleTime": 8.2,
  "productivityScore": 85
}
```

---

### Reports

#### POST /reports/time
Generate time report.

**Request:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "employeeIds": ["uuid1", "uuid2"],
  "projectIds": ["uuid3"],
  "groupBy": "employee" // employee, project, or date
}
```

**Response:**
```json
{
  "summary": {
    "totalHours": 320.5,
    "totalIdleTime": 24.0,
    "billableHours": 296.5,
    "totalEntries": 145,
    "averageSessionLength": 2.2
  },
  "groupedData": {
    "John Doe": {
      "hours": 160.0,
      "entries": 72
    }
  },
  "entries": [...]
}
```

#### POST /reports/project
Generate project report.

#### POST /reports/productivity
Generate productivity report.

#### POST /reports/export/csv
Export report as CSV.

**Request:**
```json
{
  "type": "time",
  "data": { ...report data... }
}
```

**Response:** CSV file download

---

## WebSocket Events

### Client to Server

#### auth:login
Authenticate socket connection.
```javascript
socket.emit('auth:login', { employeeId: 'uuid', token: 'jwt-token' });
```

#### time:start
Start a timer.
```javascript
socket.emit('time:start', { taskId: 'uuid', projectId: 'uuid' });
```

#### time:stop
Stop a timer.
```javascript
socket.emit('time:stop', { entryId: 'uuid', notes: 'Work completed' });
```

#### activity:log
Log an activity.
```javascript
socket.emit('activity:log', {
  type: 'task_completed',
  details: { taskId: 'uuid' }
});
```

#### idle:detected
Report idle detection.
```javascript
socket.emit('idle:detected', { duration: 300000 });
```

#### idle:returned
Report return from idle.
```javascript
socket.emit('idle:returned', { idleDuration: 300000 });
```

### Server to Client

#### employee:status
Employee status update.
```javascript
socket.on('employee:status', (data) => {
  // { employeeId, isOnline, lastActiveAt }
});
```

#### employee:activity
Employee activity log.
```javascript
socket.on('employee:activity', (data) => {
  // { id, employeeId, type, timestamp, details }
});
```

#### task:updated
Task update notification.
```javascript
socket.on('task:updated', (task) => {
  // Updated task object
});
```

#### time:entry
Time entry update.
```javascript
socket.on('time:entry', (entry) => {
  // Time entry object
});
```

#### notification
General notification.
```javascript
socket.on('notification', (notification) => {
  // { type, message }
});
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Pagination

List endpoints support pagination via query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

import { Server, Socket } from 'socket.io';
import { Database, Employee, TimeEntry, ActivityLog } from './database';
import jwt from 'jsonwebtoken';

interface SocketData {
  employeeId?: string;
  isAuthenticated: boolean;
}

export function setupSocketHandlers(io: Server, db: Database): void {
  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      (socket as any).data.employeeId = decoded.employeeId;
      (socket as any).data.isAuthenticated = true;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const employeeId = (socket as any).data.employeeId;
    console.log(`🔌 Employee connected: ${employeeId}`);

    // Join employee-specific room
    socket.join(`employee:${employeeId}`);

    // Update employee online status
    Employee.update(
      { lastActiveAt: new Date() },
      { where: { id: employeeId } }
    );

    // Broadcast employee status to admin
    socket.to('admin').emit('employee:status', {
      employeeId,
      isOnline: true,
      lastActiveAt: new Date(),
    });

    // Handle time tracking events
    socket.on('time:start', async (data: { taskId: string; projectId: string }) => {
      try {
        // Stop any running timers first
        await TimeEntry.update(
          { isRunning: false, endTime: new Date() },
          { where: { employeeId, isRunning: true } }
        );

        // Create new time entry
        const entry = await TimeEntry.create({
          employeeId,
          taskId: data.taskId,
          projectId: data.projectId,
          startTime: new Date(),
          isRunning: true,
        });

        // Notify admin
        io.to('admin').emit('time:entry', {
          ...entry.toJSON(),
          type: 'started',
        });

        socket.emit('time:started', entry);
      } catch (error) {
        console.error('Error starting timer:', error);
        socket.emit('error', { message: 'Failed to start timer' });
      }
    });

    socket.on('time:stop', async (data: { entryId: string; notes?: string }) => {
      try {
        const entry = await TimeEntry.findByPk(data.entryId);
        if (entry && entry.employeeId === employeeId) {
          const endTime = new Date();
          const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);

          await entry.update({
            endTime,
            duration,
            isRunning: false,
            notes: data.notes,
          });

          // Notify admin
          io.to('admin').emit('time:entry', {
            ...entry.toJSON(),
            type: 'stopped',
            duration,
          });

          socket.emit('time:stopped', entry);
        }
      } catch (error) {
        console.error('Error stopping timer:', error);
        socket.emit('error', { message: 'Failed to stop timer' });
      }
    });

    // Handle activity logging
    socket.on('activity:log', async (data: { type: string; details?: any }) => {
      try {
        const log = await ActivityLog.create({
          employeeId,
          type: data.type,
          timestamp: new Date(),
          details: data.details,
        });

        // Broadcast to admin
        io.to('admin').emit('employee:activity', {
          ...log.toJSON(),
          employeeId,
        });
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    });

    // Handle idle detection
    socket.on('idle:detected', async (data: { duration: number }) => {
      io.to('admin').emit('employee:idle', {
        employeeId,
        duration: data.duration,
        timestamp: new Date(),
      });
    });

    socket.on('idle:returned', async (data: { idleDuration: number }) => {
      io.to('admin').emit('employee:active', {
        employeeId,
        idleDuration: data.idleDuration,
        timestamp: new Date(),
      });
    });

    // Handle heartbeat
    socket.on('heartbeat', async () => {
      await Employee.update(
        { lastActiveAt: new Date() },
        { where: { id: employeeId } }
      );
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔌 Employee disconnected: ${employeeId}`);
      
      // Update employee status
      await Employee.update(
        { lastActiveAt: new Date() },
        { where: { id: employeeId } }
      );

      // Stop any running timers
      await TimeEntry.update(
        { isRunning: false, endTime: new Date() },
        { where: { employeeId, isRunning: true } }
      );

      // Broadcast offline status
      io.to('admin').emit('employee:status', {
        employeeId,
        isOnline: false,
        lastActiveAt: new Date(),
      });
    });
  });

  // Admin namespace
  const adminNsp = io.of('/admin');
  
  adminNsp.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const employee = await Employee.findByPk(decoded.employeeId);
      
      if (!employee || employee.role !== 'admin') {
        return next(new Error('Admin access required'));
      }

      (socket as any).data.employeeId = decoded.employeeId;
      (socket as any).data.isAuthenticated = true;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  adminNsp.on('connection', (socket: Socket) => {
    console.log('🔌 Admin connected');
    socket.join('admin');

    socket.on('disconnect', () => {
      console.log('🔌 Admin disconnected');
    });
  });
}

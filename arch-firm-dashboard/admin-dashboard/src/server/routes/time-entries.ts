import { Router } from 'express';
import { TimeEntry, Task, Project, Employee } from '../database';
import { Op, Sequelize } from 'sequelize';

const router = Router();

// Get all time entries
router.get('/', async (req, res) => {
  try {
    const { employeeId, projectId, startDate, endDate } = req.query;
    const whereClause: any = {};

    if (employeeId) whereClause.employeeId = employeeId;
    if (projectId) whereClause.projectId = projectId;
    if (startDate && endDate) {
      whereClause.startTime = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const entries = await TimeEntry.findAll({
      where: whereClause,
      order: [['startTime', 'DESC']],
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'avatar'] },
        { model: Task, as: 'task', attributes: ['id', 'title'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    res.json(entries);
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get time entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id, {
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'avatar'] },
        { model: Task, as: 'task' },
        { model: Project, as: 'project' },
      ],
    });

    if (!entry) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create time entry (manual)
router.post('/', async (req, res) => {
  try {
    const { employeeId, taskId, projectId, startTime, endTime, notes } = req.body;

    if (!employeeId || !startTime) {
      return res.status(400).json({ error: 'Employee ID and start time are required' });
    }

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    const duration = end ? Math.floor((end.getTime() - start.getTime()) / 1000) : 0;

    const entry = await TimeEntry.create({
      employeeId,
      taskId,
      projectId,
      startTime: start,
      endTime: end,
      duration,
      isRunning: !end,
      notes,
    });

    const entryWithRelations = await TimeEntry.findByPk(entry.id, {
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'avatar'] },
        { model: Task, as: 'task', attributes: ['id', 'title'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    res.status(201).json(entryWithRelations);
  } catch (error) {
    console.error('Create time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update time entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    const updates = req.body;
    
    // Recalculate duration if times changed
    if (updates.startTime || updates.endTime) {
      const start = updates.startTime ? new Date(updates.startTime) : entry.startTime;
      const end = updates.endTime ? new Date(updates.endTime) : entry.endTime;
      if (end) {
        updates.duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      }
    }

    await entry.update(updates);

    const updatedEntry = await TimeEntry.findByPk(entry.id, {
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'avatar'] },
        { model: Task, as: 'task', attributes: ['id', 'title'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Update time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete time entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await TimeEntry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    await entry.destroy();
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Delete time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // Today's total hours
    const todayEntries = await TimeEntry.findAll({
      where: {
        startTime: { [Op.gte]: today },
      },
    });
    const todayHours = todayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 3600;

    // Week's total hours
    const weekEntries = await TimeEntry.findAll({
      where: {
        startTime: { [Op.gte]: weekStart },
      },
    });
    const weekHours = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 3600;

    // Active timers
    const activeTimers = await TimeEntry.count({ where: { isRunning: true } });

    // Total idle time today
    const totalIdleTime = todayEntries.reduce((sum, entry) => sum + (entry.idleTime || 0), 0) / 3600;

    res.json({
      todayHours: Math.round(todayHours * 100) / 100,
      weekHours: Math.round(weekHours * 100) / 100,
      activeTimers,
      totalIdleTime: Math.round(totalIdleTime * 100) / 100,
      productivityScore: todayHours > 0 ? Math.round(((todayHours - totalIdleTime) / todayHours) * 100) : 0,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as timeEntriesRouter };

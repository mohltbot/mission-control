import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Employee, Task, TimeEntry, Project } from '../database';
import { Op, Sequelize } from 'sequelize';

const router = Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Task, as: 'tasks' },
        { model: TimeEntry, as: 'timeEntries', limit: 10, order: [['startTime', 'DESC']] },
      ],
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      department,
      isActive: true,
    });

    const { password: _, ...employeeWithoutPassword } = employee.toJSON();
    res.status(201).json(employeeWithoutPassword);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, department, isActive, avatar } = req.body;

    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.update({
      name: name || employee.name,
      email: email || employee.email,
      role: role || employee.role,
      department: department !== undefined ? department : employee.department,
      isActive: isActive !== undefined ? isActive : employee.isActive,
      avatar: avatar || employee.avatar,
    });

    const { password: _, ...employeeWithoutPassword } = employee.toJSON();
    res.json(employeeWithoutPassword);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee stats
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const whereClause: any = { employeeId: id };
    if (startDate && endDate) {
      whereClause.startTime = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const timeEntries = await TimeEntry.findAll({ where: whereClause });
    const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 3600;
    const totalIdleTime = timeEntries.reduce((sum, entry) => sum + (entry.idleTime || 0), 0) / 3600;

    const tasksCompleted = await Task.count({
      where: {
        assignedTo: id,
        status: 'completed',
      },
    });

    const tasksInProgress = await Task.count({
      where: {
        assignedTo: id,
        status: 'in_progress',
      },
    });

    // Project breakdown
    const projectStats = await TimeEntry.findAll({
      where: whereClause,
      attributes: [
        'projectId',
        [Sequelize.fn('SUM', Sequelize.col('duration')), 'totalDuration'],
      ],
      group: ['projectId'],
      include: [{ model: Project, as: 'project', attributes: ['name'] }],
    });

    res.json({
      totalHours: Math.round(totalHours * 100) / 100,
      totalIdleTime: Math.round(totalIdleTime * 100) / 100,
      tasksCompleted,
      tasksInProgress,
      productivityScore: totalHours > 0 ? Math.round(((totalHours - totalIdleTime) / totalHours) * 100) : 0,
      projectBreakdown: projectStats.map((stat: any) => ({
        projectId: stat.projectId,
        projectName: stat.project?.name || 'Unknown',
        hours: Math.round((stat.get('totalDuration') as number || 0) / 3600 * 100) / 100,
      })),
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee activity
router.get('/:id/activity', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const activity = await TimeEntry.findAll({
      where: { employeeId: id },
      order: [['startTime', 'DESC']],
      limit: parseInt(limit as string),
      include: [
        { model: Task, as: 'task', attributes: ['title'] },
        { model: Project, as: 'project', attributes: ['name'] },
      ],
    });

    res.json(activity);
  } catch (error) {
    console.error('Get employee activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as employeesRouter };

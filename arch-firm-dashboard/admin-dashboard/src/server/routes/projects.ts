import { Router } from 'express';
import { Project, Task, Employee } from '../database';
import { Op } from 'sequelize';

const router = Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{ model: Task, as: 'tasks' }],
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Task, as: 'tasks', include: [{ model: Employee, as: 'assignee', attributes: ['id', 'name', 'avatar'] }] },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const { name, description, clientName, status, priority, startDate, endDate, budget } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      clientName,
      status: status || 'active',
      priority: priority || 'medium',
      startDate: startDate || new Date(),
      endDate,
      budget,
      progress: 0,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates = req.body;
    await project.update(updates);

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project stats
router.get('/:id/stats', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Task, as: 'tasks' }],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = project.tasks || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
    const totalEstimatedHours = tasks.reduce((sum: number, t: any) => sum + (t.estimatedHours || 0), 0);
    const totalActualHours = tasks.reduce((sum: number, t: any) => sum + (t.actualHours || 0), 0);

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalEstimatedHours: Math.round(totalEstimatedHours * 100) / 100,
      totalActualHours: Math.round(totalActualHours * 100) / 100,
      budgetUtilization: project.budget && totalActualHours > 0 
        ? Math.round((totalActualHours / project.budget) * 100) 
        : 0,
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as projectsRouter };

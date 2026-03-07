import { Router } from 'express';
import { Task, Project, Employee } from '../database';

const router = Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { projectId, assignedTo, status } = req.query;
    const whereClause: any = {};

    if (projectId) whereClause.projectId = projectId;
    if (assignedTo) whereClause.assignedTo = assignedTo;
    if (status) whereClause.status = status;

    const tasks = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Employee, as: 'assignee', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: Employee, as: 'assignee', attributes: ['id', 'name', 'avatar', 'email'] },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, priority, estimatedHours, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      assignedTo,
      priority: priority || 'medium',
      estimatedHours,
      dueDate,
      status: 'todo',
      actualHours: 0,
    });

    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Employee, as: 'assignee', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    res.status(201).json(taskWithRelations);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = req.body;
    
    // If status is being changed to completed, set completedAt
    if (updates.status === 'completed' && task.status !== 'completed') {
      updates.completedAt = new Date();
    }

    await task.update(updates);

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Employee, as: 'assignee', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update tasks
router.post('/bulk-update', async (req, res) => {
  try {
    const { taskIds, updates } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs are required' });
    }

    await Task.update(updates, {
      where: { id: taskIds },
    });

    res.json({ message: 'Tasks updated successfully' });
  } catch (error) {
    console.error('Bulk update tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as tasksRouter };

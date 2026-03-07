import { Router } from 'express';
import { TimeEntry, Task, Project, Employee, ActivityLog } from '../database';
import { Op, Sequelize } from 'sequelize';

const router = Router();

// Generate time report
router.post('/time', async (req, res) => {
  try {
    const { startDate, endDate, employeeIds, projectIds, groupBy } = req.body;

    const whereClause: any = {
      startTime: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    if (employeeIds && employeeIds.length > 0) {
      whereClause.employeeId = { [Op.in]: employeeIds };
    }

    if (projectIds && projectIds.length > 0) {
      whereClause.projectId = { [Op.in]: projectIds };
    }

    const entries = await TimeEntry.findAll({
      where: whereClause,
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Task, as: 'task', attributes: ['id', 'title'] },
      ],
      order: [['startTime', 'ASC']],
    });

    // Calculate summary
    const totalHours = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 3600;
    const totalIdleTime = entries.reduce((sum, entry) => sum + (entry.idleTime || 0), 0) / 3600;
    const billableHours = totalHours - totalIdleTime;

    // Group data if requested
    let groupedData: any = {};
    if (groupBy === 'employee') {
      groupedData = entries.reduce((acc: any, entry: any) => {
        const key = entry.employee?.name || 'Unknown';
        if (!acc[key]) acc[key] = { hours: 0, entries: 0 };
        acc[key].hours += (entry.duration || 0) / 3600;
        acc[key].entries++;
        return acc;
      }, {});
    } else if (groupBy === 'project') {
      groupedData = entries.reduce((acc: any, entry: any) => {
        const key = entry.project?.name || 'Unknown';
        if (!acc[key]) acc[key] = { hours: 0, entries: 0 };
        acc[key].hours += (entry.duration || 0) / 3600;
        acc[key].entries++;
        return acc;
      }, {});
    } else if (groupBy === 'date') {
      groupedData = entries.reduce((acc: any, entry) => {
        const key = entry.startTime.toISOString().split('T')[0];
        if (!acc[key]) acc[key] = { hours: 0, entries: 0 };
        acc[key].hours += (entry.duration || 0) / 3600;
        acc[key].entries++;
        return acc;
      }, {});
    }

    res.json({
      summary: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalIdleTime: Math.round(totalIdleTime * 100) / 100,
        billableHours: Math.round(billableHours * 100) / 100,
        totalEntries: entries.length,
        averageSessionLength: entries.length > 0 ? Math.round((totalHours / entries.length) * 100) / 100 : 0,
      },
      groupedData,
      entries: entries.map((e: any) => ({
        id: e.id,
        employee: e.employee?.name,
        project: e.project?.name,
        task: e.task?.title,
        startTime: e.startTime,
        endTime: e.endTime,
        duration: e.duration,
        idleTime: e.idleTime,
        notes: e.notes,
      })),
    });
  } catch (error) {
    console.error('Generate time report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate project report
router.post('/project', async (req, res) => {
  try {
    const { projectIds, startDate, endDate } = req.body;

    const whereClause: any = {};
    if (projectIds && projectIds.length > 0) {
      whereClause.id = { [Op.in]: projectIds };
    }

    const projects = await Project.findAll({
      where: whereClause,
      include: [
        { 
          model: Task, 
          as: 'tasks',
          where: startDate && endDate ? {
            createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
          } : undefined,
          required: false,
        },
        { 
          model: TimeEntry, 
          as: 'timeEntries',
          where: startDate && endDate ? {
            startTime: { [Op.between]: [new Date(startDate), new Date(endDate)] }
          } : undefined,
          required: false,
        },
      ],
    });

    const report = projects.map((project: any) => {
      const tasks = project.tasks || [];
      const timeEntries = project.timeEntries || [];
      
      const totalHours = timeEntries.reduce((sum: number, entry: any) => sum + (entry.duration || 0), 0) / 3600;
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
      const totalTasks = tasks.length;

      return {
        projectId: project.id,
        projectName: project.name,
        clientName: project.clientName,
        status: project.status,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        totalHours: Math.round(totalHours * 100) / 100,
        budget: project.budget,
        budgetUsed: project.budget ? Math.round((totalHours / project.budget) * 100) : 0,
      };
    });

    res.json({
      summary: {
        totalProjects: report.length,
        totalHours: Math.round(report.reduce((sum, p) => sum + p.totalHours, 0) * 100) / 100,
        averageCompletion: report.length > 0 
          ? Math.round(report.reduce((sum, p) => sum + p.completionRate, 0) / report.length) 
          : 0,
      },
      projects: report,
    });
  } catch (error) {
    console.error('Generate project report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate employee productivity report
router.post('/productivity', async (req, res) => {
  try {
    const { employeeIds, startDate, endDate } = req.body;

    const whereClause: any = {};
    if (employeeIds && employeeIds.length > 0) {
      whereClause.id = { [Op.in]: employeeIds };
    }

    const employees = await Employee.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'department', 'avatar'],
      include: [
        {
          model: TimeEntry,
          as: 'timeEntries',
          where: {
            startTime: { [Op.between]: [new Date(startDate), new Date(endDate)] },
          },
          required: false,
        },
        {
          model: Task,
          as: 'tasks',
          where: {
            createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
          },
          required: false,
        },
      ],
    });

    const report = employees.map((employee: any) => {
      const timeEntries = employee.timeEntries || [];
      const tasks = employee.tasks || [];

      const totalHours = timeEntries.reduce((sum: number, entry: any) => sum + (entry.duration || 0), 0) / 3600;
      const totalIdleTime = timeEntries.reduce((sum: number, entry: any) => sum + (entry.idleTime || 0), 0) / 3600;
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;

      return {
        employeeId: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        avatar: employee.avatar,
        totalHours: Math.round(totalHours * 100) / 100,
        idleTime: Math.round(totalIdleTime * 100) / 100,
        productiveHours: Math.round((totalHours - totalIdleTime) * 100) / 100,
        productivityScore: totalHours > 0 ? Math.round(((totalHours - totalIdleTime) / totalHours) * 100) : 0,
        tasksCompleted: completedTasks,
        sessionsCount: timeEntries.length,
      };
    });

    // Sort by productivity score
    report.sort((a, b) => b.productivityScore - a.productivityScore);

    res.json({
      summary: {
        totalEmployees: report.length,
        averageProductivity: report.length > 0 
          ? Math.round(report.reduce((sum, e) => sum + e.productivityScore, 0) / report.length) 
          : 0,
        totalHours: Math.round(report.reduce((sum, e) => sum + e.totalHours, 0) * 100) / 100,
      },
      employees: report,
    });
  } catch (error) {
    console.error('Generate productivity report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export report as CSV
router.post('/export/csv', async (req, res) => {
  try {
    const { type, data } = req.body;

    let csv = '';
    
    if (type === 'time') {
      csv = 'Date,Employee,Project,Task,Duration (hours),Idle Time (hours),Notes\n';
      data.entries.forEach((entry: any) => {
        csv += `${entry.startTime},${entry.employee},${entry.project},${entry.task},${(entry.duration / 3600).toFixed(2)},${(entry.idleTime / 3600).toFixed(2)},"${entry.notes || ''}"\n`;
      });
    } else if (type === 'productivity') {
      csv = 'Employee,Department,Total Hours,Productive Hours,Productivity Score,Tasks Completed\n';
      data.employees.forEach((emp: any) => {
        csv += `${emp.name},${emp.department || 'N/A'},${emp.totalHours},${emp.productiveHours},${emp.productivityScore}%,${emp.tasksCompleted}\n`;
      });
    } else if (type === 'project') {
      csv = 'Project,Client,Status,Total Tasks,Completed Tasks,Completion Rate,Total Hours,Budget Used\n';
      data.projects.forEach((proj: any) => {
        csv += `${proj.projectName},${proj.clientName || 'N/A'},${proj.status},${proj.totalTasks},${proj.completedTasks},${proj.completionRate}%,${proj.totalHours},${proj.budgetUsed}%\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="report-${type}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as reportsRouter };

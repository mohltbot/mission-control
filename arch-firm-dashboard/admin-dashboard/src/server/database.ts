import { Sequelize, DataTypes, Model } from 'sequelize';
import path from 'path';

// Define models
export class Employee extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'employee';
  public department!: string;
  public avatar!: string;
  public isActive!: boolean;
  public lastActiveAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class Project extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public clientName!: string;
  public status!: 'active' | 'completed' | 'on_hold' | 'cancelled';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public startDate!: Date;
  public endDate!: Date;
  public budget!: number;
  public progress!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public tasks?: Task[];
}

export class Task extends Model {
  public id!: string;
  public projectId!: string;
  public title!: string;
  public description!: string;
  public assignedTo!: string;
  public status!: 'todo' | 'in_progress' | 'review' | 'completed';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public estimatedHours!: number;
  public actualHours!: number;
  public dueDate!: Date;
  public completedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class TimeEntry extends Model {
  public id!: string;
  public employeeId!: string;
  public taskId!: string;
  public projectId!: string;
  public startTime!: Date;
  public endTime!: Date;
  public duration!: number;
  public isRunning!: boolean;
  public idleTime!: number;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class ActivityLog extends Model {
  public id!: string;
  public employeeId!: string;
  public type!: string;
  public timestamp!: Date;
  public details!: any;
  public readonly createdAt!: Date;
}

export class RefreshToken extends Model {
  public id!: string;
  public token!: string;
  public employeeId!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

export class Database {
  public sequelize: Sequelize;

  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      // Use SQLite for development
      this.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../../data/archtrack.db'),
        logging: false,
      });
    } else {
      // Use PostgreSQL for production
      this.sequelize = new Sequelize(
        process.env.DATABASE_URL || '',
        {
          dialect: 'postgres',
          logging: false,
        }
      );
    }

    this.initializeModels();
  }

  private initializeModels(): void {
    // Employee model
    Employee.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('admin', 'employee'),
          defaultValue: 'employee',
        },
        department: {
          type: DataTypes.STRING,
        },
        avatar: {
          type: DataTypes.STRING,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        lastActiveAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'employees',
      }
    );

    // Project model
    Project.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        clientName: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.ENUM('active', 'completed', 'on_hold', 'cancelled'),
          defaultValue: 'active',
        },
        priority: {
          type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
          defaultValue: 'medium',
        },
        startDate: {
          type: DataTypes.DATE,
        },
        endDate: {
          type: DataTypes.DATE,
        },
        budget: {
          type: DataTypes.DECIMAL(10, 2),
        },
        progress: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'projects',
      }
    );

    // Task model
    Task.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        projectId: {
          type: DataTypes.UUID,
          references: {
            model: Project,
            key: 'id',
          },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        assignedTo: {
          type: DataTypes.UUID,
          references: {
            model: Employee,
            key: 'id',
          },
        },
        status: {
          type: DataTypes.ENUM('todo', 'in_progress', 'review', 'completed'),
          defaultValue: 'todo',
        },
        priority: {
          type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
          defaultValue: 'medium',
        },
        estimatedHours: {
          type: DataTypes.FLOAT,
        },
        actualHours: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
        dueDate: {
          type: DataTypes.DATE,
        },
        completedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'tasks',
      }
    );

    // TimeEntry model
    TimeEntry.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        employeeId: {
          type: DataTypes.UUID,
          references: {
            model: Employee,
            key: 'id',
          },
        },
        taskId: {
          type: DataTypes.UUID,
          references: {
            model: Task,
            key: 'id',
          },
        },
        projectId: {
          type: DataTypes.UUID,
          references: {
            model: Project,
            key: 'id',
          },
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.DATE,
        },
        duration: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        isRunning: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        idleTime: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        notes: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'time_entries',
      }
    );

    // ActivityLog model
    ActivityLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        employeeId: {
          type: DataTypes.UUID,
          references: {
            model: Employee,
            key: 'id',
          },
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        timestamp: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        details: {
          type: DataTypes.JSON,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'activity_logs',
      }
    );

    // RefreshToken model
    RefreshToken.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        employeeId: {
          type: DataTypes.UUID,
          references: {
            model: Employee,
            key: 'id',
          },
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize: this.sequelize,
        tableName: 'refresh_tokens',
      }
    );

    // Define associations
    Employee.hasMany(Task, { foreignKey: 'assignedTo', as: 'tasks' });
    Task.belongsTo(Employee, { foreignKey: 'assignedTo', as: 'assignee' });

    Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
    Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

    Employee.hasMany(TimeEntry, { foreignKey: 'employeeId', as: 'timeEntries' });
    TimeEntry.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

    Task.hasMany(TimeEntry, { foreignKey: 'taskId', as: 'timeEntries' });
    TimeEntry.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

    // Sync database
    this.sequelize.sync({ alter: true }).then(() => {
      console.log('✅ Database synchronized');
      this.seedAdminUser();
    });
  }

  private async seedAdminUser(): Promise<void> {
    const bcrypt = require('bcryptjs');
    
    const adminExists = await Employee.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await Employee.create({
        name: 'Admin User',
        email: 'admin@archtrack.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Default admin user created (admin@archtrack.com / admin123)');
      
      // Seed test employees
      await this.seedTestData(bcrypt);
    }
  }
  
  private async seedTestData(bcrypt: any): Promise<void> {
    // Create test employees
    const employees = await Promise.all([
      Employee.create({
        name: 'Sarah Chen',
        email: 'sarah@archtrack.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        department: 'Architecture',
        isActive: true,
      }),
      Employee.create({
        name: 'Michael Rodriguez',
        email: 'michael@archtrack.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        department: 'Interior Design',
        isActive: true,
      }),
      Employee.create({
        name: 'Emily Watson',
        email: 'emily@archtrack.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        department: 'Architecture',
        isActive: true,
      }),
      Employee.create({
        name: 'David Kim',
        email: 'david@archtrack.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employee',
        department: 'Structural Engineering',
        isActive: true,
      }),
    ]);
    
    console.log('✅ Test employees created');
    
    // Create test projects
    const projects = await Promise.all([
      Project.create({
        name: 'Downtown Office Tower',
        description: 'A 45-story commercial office building in the financial district',
        clientName: 'Metro Development Corp',
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-06-30'),
        budget: 12500000,
        progress: 35,
      }),
      Project.create({
        name: 'Riverside Residential Complex',
        description: 'Luxury waterfront apartments with 120 units',
        clientName: 'Riverside Properties LLC',
        status: 'active',
        priority: 'urgent',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-03-15'),
        budget: 8500000,
        progress: 22,
      }),
      Project.create({
        name: 'Community Cultural Center',
        description: 'Multi-purpose cultural facility with theater and gallery',
        clientName: 'City Arts Council',
        status: 'active',
        priority: 'medium',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-08-31'),
        budget: 4200000,
        progress: 15,
      }),
      Project.create({
        name: 'Historic Building Renovation',
        description: 'Restoration of 1920s landmark building',
        clientName: 'Heritage Preservation Society',
        status: 'on_hold',
        priority: 'low',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-12-31'),
        budget: 2800000,
        progress: 60,
      }),
      Project.create({
        name: 'Green Valley Mall Expansion',
        description: '200,000 sq ft retail expansion with sustainable design',
        clientName: 'Green Valley Retail Group',
        status: 'completed',
        priority: 'high',
        startDate: new Date('2023-01-10'),
        endDate: new Date('2024-01-10'),
        budget: 15000000,
        progress: 100,
      }),
    ]);
    
    console.log('✅ Test projects created');
    
    // Create test tasks
    const tasks = await Promise.all([
      // Downtown Office Tower tasks
      Task.create({
        projectId: projects[0].id,
        title: 'Complete structural analysis',
        description: 'Finalize load calculations and structural framework',
        assignedTo: employees[3].id,
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 80,
        actualHours: 45,
        dueDate: new Date('2024-04-15'),
      }),
      Task.create({
        projectId: projects[0].id,
        title: 'Design facade mockups',
        description: 'Create 3D visualizations of exterior facade options',
        assignedTo: employees[0].id,
        status: 'in_progress',
        priority: 'medium',
        estimatedHours: 60,
        actualHours: 30,
        dueDate: new Date('2024-04-30'),
      }),
      Task.create({
        projectId: projects[0].id,
        title: 'Lobby interior concepts',
        description: 'Develop interior design concepts for main lobby',
        assignedTo: employees[1].id,
        status: 'todo',
        priority: 'medium',
        estimatedHours: 40,
        actualHours: 0,
        dueDate: new Date('2024-05-15'),
      }),
      
      // Riverside Residential tasks
      Task.create({
        projectId: projects[1].id,
        title: 'Unit layout finalization',
        description: 'Finalize apartment layouts and floor plans',
        assignedTo: employees[0].id,
        status: 'in_progress',
        priority: 'urgent',
        estimatedHours: 100,
        actualHours: 65,
        dueDate: new Date('2024-04-01'),
      }),
      Task.create({
        projectId: projects[1].id,
        title: 'Amenity space design',
        description: 'Design gym, pool, and common areas',
        assignedTo: employees[1].id,
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 50,
        actualHours: 20,
        dueDate: new Date('2024-04-20'),
      }),
      
      // Cultural Center tasks
      Task.create({
        projectId: projects[2].id,
        title: 'Acoustic engineering review',
        description: 'Review theater acoustics with consultant',
        assignedTo: employees[3].id,
        status: 'todo',
        priority: 'high',
        estimatedHours: 30,
        actualHours: 0,
        dueDate: new Date('2024-05-01'),
      }),
      Task.create({
        projectId: projects[2].id,
        title: 'Gallery lighting design',
        description: 'Design lighting scheme for art gallery',
        assignedTo: employees[2].id,
        status: 'in_progress',
        priority: 'medium',
        estimatedHours: 25,
        actualHours: 10,
        dueDate: new Date('2024-04-25'),
      }),
    ]);
    
    console.log('✅ Test tasks created');
    
    // Create some time entries for today
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    
    await Promise.all([
      TimeEntry.create({
        employeeId: employees[0].id,
        taskId: tasks[1].id,
        projectId: projects[0].id,
        startTime: today,
        endTime: new Date(today.getTime() + 4 * 60 * 60 * 1000),
        duration: 4 * 60 * 60,
        isRunning: false,
        idleTime: 300,
        notes: 'Worked on facade options A and B',
      }),
      TimeEntry.create({
        employeeId: employees[0].id,
        taskId: tasks[3].id,
        projectId: projects[1].id,
        startTime: new Date(today.getTime() + 4.5 * 60 * 60 * 1000),
        isRunning: true,
        duration: 2 * 60 * 60,
        idleTime: 120,
      }),
      TimeEntry.create({
        employeeId: employees[1].id,
        taskId: tasks[4].id,
        projectId: projects[1].id,
        startTime: today,
        endTime: new Date(today.getTime() + 6 * 60 * 60 * 1000),
        duration: 6 * 60 * 60,
        isRunning: false,
        idleTime: 600,
        notes: 'Pool area concept approved by client',
      }),
      TimeEntry.create({
        employeeId: employees[3].id,
        taskId: tasks[0].id,
        projectId: projects[0].id,
        startTime: today,
        isRunning: true,
        duration: 5 * 60 * 60,
        idleTime: 180,
      }),
    ]);
    
    console.log('✅ Test time entries created');
    console.log('');
    console.log('🎉 Test data seeding complete!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Admin:    admin@archtrack.com / admin123');
    console.log('  Employees: [name]@archtrack.com / password123');
    console.log('');
  }
}

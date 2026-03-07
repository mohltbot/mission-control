import React, { useState } from 'react';
import { Download, FileText, Calendar, Users, FolderKanban } from 'lucide-react';

export function ReportsPage() {
  const [reportType, setReportType] = useState<'time' | 'project' | 'productivity'>('time');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/reports/${reportType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCSV = async () => {
    if (!reportData) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/reports/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: reportType,
          data: reportData,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export detailed reports
          </p>
        </div>

        {/* Report Configuration */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value as any);
                  setReportData(null);
                }}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="time">Time Report</option>
                <option value="project">Project Report</option>
                <option value="productivity">Productivity Report</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              {reportType === 'time' && (
                <>
                  <SummaryCard
                    title="Total Hours"
                    value={`${reportData.summary?.totalHours?.toFixed(1) || 0}h`}
                    icon={Calendar}
                  />
                  <SummaryCard
                    title="Billable Hours"
                    value={`${reportData.summary?.billableHours?.toFixed(1) || 0}h`}
                    icon={FileText}
                  />
                  <SummaryCard
                    title="Idle Time"
                    value={`${reportData.summary?.totalIdleTime?.toFixed(1) || 0}h`}
                    icon={Calendar}
                  />
                  <SummaryCard
                    title="Entries"
                    value={reportData.summary?.totalEntries || 0}
                    icon={FileText}
                  />
                </>
              )}
              {reportType === 'productivity' && (
                <>
                  <SummaryCard
                    title="Total Employees"
                    value={reportData.summary?.totalEmployees || 0}
                    icon={Users}
                  />
                  <SummaryCard
                    title="Avg Productivity"
                    value={`${reportData.summary?.averageProductivity || 0}%`}
                    icon={FileText}
                  />
                  <SummaryCard
                    title="Total Hours"
                    value={`${reportData.summary?.totalHours?.toFixed(1) || 0}h`}
                    icon={Calendar}
                  />
                  <SummaryCard
                    title="Team Efficiency"
                    value={`${reportData.summary?.averageProductivity >= 80 ? 'High' : 'Normal'}`}
                    icon={FileText}
                  />
                </>
              )}
              {reportType === 'project' && (
                <>
                  <SummaryCard
                    title="Total Projects"
                    value={reportData.summary?.totalProjects || 0}
                    icon={FolderKanban}
                  />
                  <SummaryCard
                    title="Total Hours"
                    value={`${reportData.summary?.totalHours?.toFixed(1) || 0}h`}
                    icon={Calendar}
                  />
                  <SummaryCard
                    title="Avg Completion"
                    value={`${reportData.summary?.averageCompletion || 0}%`}
                    icon={FileText}
                  />
                  <SummaryCard
                    title="Status"
                    value={reportData.summary?.averageCompletion >= 80 ? 'On Track' : 'Review Needed'}
                    icon={FileText}
                  />
                </>
              )}
            </div>

            {/* Detailed Data */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Detailed Data</h3>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                {reportType === 'time' && (
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">Date</th>
                        <th className="text-left px-6 py-3 font-medium">Employee</th>
                        <th className="text-left px-6 py-3 font-medium">Project</th>
                        <th className="text-left px-6 py-3 font-medium">Task</th>
                        <th className="text-left px-6 py-3 font-medium">Duration</th>
                        <th className="text-left px-6 py-3 font-medium">Idle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.entries?.slice(0, 20).map((entry: any) => (
                        <tr key={entry.id} className="hover:bg-muted/30">
                          <td className="px-6 py-3 text-sm">
                            {new Date(entry.startTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3 text-sm">{entry.employee}</td>
                          <td className="px-6 py-3 text-sm">{entry.project}</td>
                          <td className="px-6 py-3 text-sm">{entry.task}</td>
                          <td className="px-6 py-3 text-sm">
                            {((entry.duration || 0) / 3600).toFixed(2)}h
                          </td>
                          <td className="px-6 py-3 text-sm">
                            {((entry.idleTime || 0) / 3600).toFixed(2)}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'productivity' && (
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">Employee</th>
                        <th className="text-left px-6 py-3 font-medium">Department</th>
                        <th className="text-left px-6 py-3 font-medium">Total Hours</th>
                        <th className="text-left px-6 py-3 font-medium">Productive</th>
                        <th className="text-left px-6 py-3 font-medium">Score</th>
                        <th className="text-left px-6 py-3 font-medium">Tasks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.employees?.map((emp: any) => (
                        <tr key={emp.employeeId} className="hover:bg-muted/30">
                          <td className="px-6 py-3 text-sm font-medium">{emp.name}</td>
                          <td className="px-6 py-3 text-sm">{emp.department || 'N/A'}</td>
                          <td className="px-6 py-3 text-sm">{emp.totalHours.toFixed(1)}h</td>
                          <td className="px-6 py-3 text-sm">{emp.productiveHours.toFixed(1)}h</td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              emp.productivityScore >= 80
                                ? 'bg-green-100 text-green-700'
                                : emp.productivityScore >= 60
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {emp.productivityScore}%
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm">{emp.tasksCompleted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'project' && (
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">Project</th>
                        <th className="text-left px-6 py-3 font-medium">Client</th>
                        <th className="text-left px-6 py-3 font-medium">Status</th>
                        <th className="text-left px-6 py-3 font-medium">Tasks</th>
                        <th className="text-left px-6 py-3 font-medium">Completed</th>
                        <th className="text-left px-6 py-3 font-medium">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.projects?.map((proj: any) => (
                        <tr key={proj.projectId} className="hover:bg-muted/30">
                          <td className="px-6 py-3 text-sm font-medium">{proj.projectName}</td>
                          <td className="px-6 py-3 text-sm">{proj.clientName}</td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              proj.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {proj.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm">{proj.totalTasks}</td>
                          <td className="px-6 py-3 text-sm">{proj.completedTasks}</td>
                          <td className="px-6 py-3 text-sm">{proj.totalHours.toFixed(1)}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

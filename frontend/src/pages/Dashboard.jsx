import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import moment from 'moment';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: tasks } = await axios.get('/tasks');
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const overdue = tasks.filter(t => 
          t.status !== 'Completed' && moment(t.dueDate).isBefore(moment(), 'day')
        ).length;

        // Group tasks by project
        const projectStatsMap = {};
        tasks.forEach(t => {
          const pTitle = t.project?.title || 'Unknown';
          if (!projectStatsMap[pTitle]) projectStatsMap[pTitle] = { name: pTitle, completed: 0, active: 0 };
          if (t.status === 'Completed') projectStatsMap[pTitle].completed += 1;
          else projectStatsMap[pTitle].active += 1;
        });

        const projectData = Object.values(projectStatsMap);

        setStats({
          total, completed, pending, inProgress, overdue, projectData,
          pieData: [
            { name: 'Completed', value: completed },
            { name: 'In Progress', value: inProgress },
            { name: 'Pending', value: pending }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b']; // Green, Blue, Yellow

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="glass p-6 rounded-2xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats?.total || 0} icon={ListTodo} colorClass="text-indigo-600" bgClass="bg-indigo-100 dark:bg-indigo-500/20" />
        <StatCard title="Completed" value={stats?.completed || 0} icon={CheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-100 dark:bg-emerald-500/20" />
        <StatCard title="Pending" value={(stats?.pending || 0) + (stats?.inProgress || 0)} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-100 dark:bg-amber-500/20" />
        <StatCard title="Overdue" value={stats?.overdue || 0} icon={AlertCircle} colorClass="text-red-600" bgClass="bg-red-100 dark:bg-red-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Task Status</h3>
          <div className="h-72">
            {stats?.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No tasks found</div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats?.pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Project Progress</h3>
          <div className="h-72">
            {stats?.projectData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} name="Completed" />
                  <Bar dataKey="active" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No project data found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

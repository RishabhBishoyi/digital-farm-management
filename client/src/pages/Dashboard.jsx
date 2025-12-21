import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";
import { LayoutDashboard, AlertTriangle, Activity, Bell } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    unsafeAnimals: 0,
    status: "SAFE",
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const statsRes = await axios.get("/api/animals/stats", config);
        setStats(statsRes.data);

        const notifRes = await axios.get("/api/notifications", config);
        setNotifications(notifRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="text-green-500 w-8 h-8" />
        <h2 className="text-3xl font-bold text-slate-100">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Animals Card */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Animals</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalAnimals}</h3>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-full">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            <span className="text-green-400 font-medium">↑ 2</span> since last month
          </div>
        </div>

        {/* Withdrawal Alert Card */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Under Withdrawal</p>
              <h3 className={`text-4xl font-bold mt-2 ${stats.unsafeAnimals > 0 ? 'text-red-500' : 'text-green-500'}`}>{stats.unsafeAnimals}</h3>
            </div>
            <div className={`p-3 rounded-full ${stats.unsafeAnimals > 0 ? 'bg-red-900/30' : 'bg-green-900/30'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.unsafeAnimals > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            {stats.unsafeAnimals > 0 ? 'Requires attention' : 'No animals under withdrawal'}
          </div>
        </div>

        {/* Overall Status Card */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Farm Status</p>
              <div className="mt-2">
                <StatusBadge status={stats.status} />
              </div>
            </div>
            <div className="p-3 bg-green-900/30 rounded-full">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
           <div className="mt-4 text-sm text-slate-400">
            {stats.status === 'SAFE' ? 'All systems operational' : 'Action required'}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-100">Notifications</h3>
        </div>
        <div className="space-y-4">
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif._id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <p className="text-slate-200">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                            {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-slate-500 italic">No new notifications.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

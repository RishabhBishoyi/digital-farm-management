import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, AlertTriangle, Users, Tractor } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalAnimals: 0,
    unsafeAnimals: 0,
    totalUsers: 0,
  });
  const [farmData, setFarmData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const [statsRes, farmsRes] = await Promise.all([
          axios.get("/api/admin/stats", config),
          axios.get("/api/admin/farms", config)
        ]);

        setStats(statsRes.data);
        
        // Process farm data for chart
        const processedFarmData = farmsRes.data.map(farm => ({
          name: farm.name,
          animals: farm.animalCount || 0,
          unsafe: farm.unsafeCount || 0
        })).slice(0, 10); // Top 10 farms
        
        setFarmData(processedFarmData);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const pieData = [
    { name: "Safe Animals", value: stats.totalAnimals - stats.unsafeAnimals },
    { name: "Unsafe Animals", value: stats.unsafeAnimals },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="text-green-500 w-8 h-8" />
        <h2 className="text-3xl font-bold text-slate-100">System Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase">Total Farms</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalFarms}</h3>
            </div>
            <div className="p-3 bg-green-900/30 rounded-full">
              <Tractor className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase">Total Animals</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalAnimals}</h3>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-full">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase">Unsafe Animals</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">{stats.unsafeAnimals}</h3>
            </div>
            <div className="p-3 bg-red-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase">Registered Farmers</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-900/30 rounded-full">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h3 className="text-xl font-bold text-slate-100 mb-6">Animals per Farm</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
                <Bar dataKey="animals" fill="#3B82F6" name="Total Animals" />
                <Bar dataKey="unsafe" fill="#EF4444" name="Unsafe Animals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h3 className="text-xl font-bold text-slate-100 mb-6">Health Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

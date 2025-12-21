import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { Search, Filter, Trash2 } from "lucide-react";

const Animals = () => {
  const { user } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.get("/api/animals", config);
        setAnimals(res.data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this animal?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`/api/animals/${id}`, config);
        setAnimals(animals.filter((animal) => animal._id !== id));
      } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Failed to delete animal");
      }
    }
  };

  // Get unique animal types for filter dropdown
  const animalTypes = ["all", ...new Set(animals.map(a => a.type))];

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = (animal.tagId || animal.animalId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || animal.type === filterType;
    const matchesStatus = filterStatus === "all" || animal.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-100">Livestock Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search animals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none placeholder-slate-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none capitalize"
            >
                {animalTypes.map(type => (
                    <option key={type} value={type} className="capitalize bg-slate-800">
                        {type === 'all' ? 'All Types' : type}
                    </option>
                ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none"
            >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="SAFE" className="bg-slate-800">Safe</option>
                <option value="UNSAFE" className="bg-slate-800">Unsafe</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 shadow-lg rounded-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Animal ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Age (Months)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-slate-400">Loading...</td>
              </tr>
            ) : filteredAnimals.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-slate-400">No animals found.</td>
              </tr>
            ) : (
              filteredAnimals.map((animal) => (
                <tr key={animal._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100">{animal.tagId || animal.animalId}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{animal.type}</td>
                  <td className="px-6 py-4 text-slate-300">{animal.age}</td>
                  <td className="px-6 py-4">
                    <StatusBadge 
                        status={animal.status} 
                        daysRemaining={animal.daysRemaining} 
                        remainingUnit={animal.remainingUnit}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => handleDelete(animal._id)}
                        className="text-red-400 hover:text-red-300 font-medium text-sm flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Animals;

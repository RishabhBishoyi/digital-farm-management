import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import StatusBadge from "../../components/StatusBadge";
import { AlertTriangle } from "lucide-react";

const UnsafeList = () => {
  const { user } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchUnsafe = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.get("/api/admin/unsafe", config);
        setAnimals(res.data);
      } catch (error) {
        console.error("Error fetching unsafe animals:", error);
      }
    };

    if (user) {
      fetchUnsafe();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-900/30 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100">Risk Monitor: Unsafe Animals</h2>
      </div>

      <div className="bg-slate-800 shadow-lg rounded-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-red-900/20 border-b border-red-900/30">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-red-300 uppercase tracking-wider">Animal ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-red-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-red-300 uppercase tracking-wider">Farm Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-red-300 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-red-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {animals.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                  No unsafe animals detected. Good job!
                </td>
              </tr>
            ) : (
              animals.map((animal) => (
                <tr key={animal._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100">{animal.animalId}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{animal.type}</td>
                  <td className="px-6 py-4 text-slate-100 font-medium">{animal.farm?.name}</td>
                  <td className="px-6 py-4 text-slate-300">{animal.farm?.location}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={animal.status} />
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

export default UnsafeList;

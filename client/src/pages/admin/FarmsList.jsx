import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Tractor, MapPin } from "lucide-react";

const FarmsList = () => {
  const { user } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.get("/api/admin/farms", config);
        setFarms(res.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    if (user) {
      fetchFarms();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-slate-100 mb-6">Registered Farms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <div key={farm._id} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <Tractor className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100">{farm.name}</h3>
                <div className="flex items-center text-sm text-slate-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  {farm.location}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-slate-700 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Owner:</span>
                <span className="font-medium text-slate-200">{farm.owner?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Animals:</span>
                <span className="font-medium text-slate-200">{farm.animalCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Unsafe Animals:</span>
                <span className={`font-medium ${farm.unsafeCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {farm.unsafeCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmsList;

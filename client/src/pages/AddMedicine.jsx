import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Syringe, Search } from "lucide-react";

const AddMedicine = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    animalId: "",
    medicineName: "",
    notes: "",
  });
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/animals", config);
        setAnimals(data);
        
        // Extract unique types
        const types = [...new Set(data.map(a => a.type))];
        setAnimalTypes(types);
        
        setLoadingAnimals(false);
      } catch (err) {
        setError("Failed to load animals");
        setLoadingAnimals(false);
      }
    };

    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setFormData({ ...formData, animalId: "", medicineName: "" });
    setSelectedAnimal(null);
    setMedicines([]);
    
    if (type) {
        const filtered = animals.filter(a => a.type === type);
        setFilteredAnimals(filtered);
    } else {
        setFilteredAnimals([]);
    }
  };

  const handleAnimalChange = async (e) => {
    const selectedId = e.target.value;
    const animal = animals.find((a) => a.animalId === selectedId);
    
    setFormData({ ...formData, animalId: selectedId, medicineName: "" });
    setSelectedAnimal(animal);
    setMedicines([]);

    if (animal) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Fetch medicines available for this animal type
        const { data } = await axios.get(`/api/medicines/available/${animal.type}`, config);
        setMedicines(data);
      } catch (err) {
        console.error("Failed to load medicines", err);
        // Fallback or error handling
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Backend will calculate withdrawal days based on medicine name
      await axios.post("/api/medicines", formData, config);
      setSuccess("Medicine usage recorded successfully!");
      setFormData({
        animalId: "",
        medicineName: "",
        notes: "",
      });
      setSelectedAnimal(null);
      setMedicines([]);
    } catch (error) {
      setError(error.response?.data?.message || "Error recording medicine");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <Syringe className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Record Medicine Usage</h2>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Animal Type</label>
            <select
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-4"
            >
                <option value="" className="bg-slate-800">-- Select Type --</option>
                {animalTypes.map((type) => (
                    <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Animal ID</label>
            <div className="relative">
                <select
                    name="animalId"
                    value={formData.animalId}
                    onChange={handleAnimalChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    required
                    disabled={!selectedType}
                >
                    <option value="" className="bg-slate-800">-- Select Animal ID --</option>
                    {filteredAnimals.map((animal) => (
                        <option key={animal._id} value={animal.animalId} className="bg-slate-800">
                            {animal.animalId}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
            </div>
            {!selectedType && <p className="text-xs text-slate-500 mt-1">Please select an animal type first.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Medicine Name</label>
            <div className="relative">
                <input 
                    list="medicine-options"
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleChange}
                    placeholder="Select or type medicine name..."
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    required
                    disabled={!selectedAnimal}
                />
                <datalist id="medicine-options">
                    {medicines.map((med) => (
                        <option key={med._id} value={med.name} />
                    ))}
                    <option value="Test Medicine (1 min)" />
                </datalist>
            </div>
            <p className="text-xs text-slate-500 mt-1">
                {!selectedAnimal 
                    ? "Select an animal first to see available medicines." 
                    : "Tip: Type 'Test' to create a 1-minute withdrawal test."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none" 
              placeholder="Any additional details..." 
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <Syringe className="w-5 h-5" />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;

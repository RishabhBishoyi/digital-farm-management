import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const AddAnimal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    animalId: "",
    type: "",
    age: "",
    weight: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("/api/animals", formData, config);
      navigate("/animals");
    } catch (error) {
      setError(error.response?.data?.message || "Error adding animal");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-900/30 rounded-lg">
            <PlusCircle className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Register New Animal</h2>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Animal ID</label>
              <input 
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                placeholder="e.g. A-101" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select Type</option>
                <option value="cow" className="bg-slate-800">Cow</option>
                <option value="goat" className="bg-slate-800">Goat</option>
                <option value="sheep" className="bg-slate-800">Sheep</option>
                <option value="pig" className="bg-slate-800">Pig</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Age (Months)</label>
              <input 
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                placeholder="e.g. 24" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
              <input 
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                placeholder="e.g. 450" 
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add Animal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnimal;

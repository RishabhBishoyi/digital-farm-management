import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Bell, Send, Users } from "lucide-react";

const AdminNotifications = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFarmers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // We can reuse the farms endpoint which returns owner details
            const { data } = await axios.get("/api/admin/farms", config);
            // Extract unique owners
            const owners = data.map(farm => farm.owner).filter(Boolean);
            // Remove duplicates if any (though one farm per user usually)
            const uniqueOwners = Array.from(new Set(owners.map(a => a._id)))
                .map(id => {
                return owners.find(a => a._id === id)
                });
            setFarmers(uniqueOwners);
        } catch (err) {
            console.error("Failed to fetch farmers", err);
        }
    };
    if (user) {
        fetchFarmers();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
        setError("Message cannot be empty");
        return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = { message };
      if (recipientId) {
          payload.recipientId = recipientId;
      }
      
      await axios.post("/api/notifications", payload, config);
      setSuccess(recipientId ? "Notification sent to farmer!" : "Broadcast sent to all farmers!");
      setMessage("");
      setRecipientId("");
    } catch (error) {
      setError(error.response?.data?.message || "Error sending notification");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Send Notification</h2>
        </div>

        <p className="text-slate-400 mb-6">
            Send a message to all farmers or a specific individual.
        </p>

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
            <label className="block text-sm font-medium text-slate-300 mb-1">Recipient</label>
            <div className="relative">
                <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                    <option value="" className="bg-slate-800">All Farmers (Broadcast)</option>
                    {farmers.map((farmer) => (
                        <option key={farmer._id} value={farmer._id} className="bg-slate-800">
                            {farmer.name} ({farmer.email})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <Users className="w-4 h-4 text-slate-400" />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none" 
              placeholder="Type your message here..." 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {recipientId ? "Send Message" : "Send Broadcast"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
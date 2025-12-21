import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import AddAnimal from "./pages/AddAnimal";
import AddMedicine from "./pages/AddMedicine";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FarmsList from "./pages/admin/FarmsList";
import UnsafeList from "./pages/admin/UnsafeList";
import AdminNotifications from "./pages/admin/AdminNotifications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Farmer Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/add-animal" element={<AddAnimal />} />
        <Route path="/add-medicine" element={<AddMedicine />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/farms" element={<FarmsList />} />
        <Route path="/admin/unsafe" element={<UnsafeList />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

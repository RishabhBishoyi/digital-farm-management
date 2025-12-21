import { NavLink, useNavigate } from "react-router-dom";
import { Tractor, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-400 font-semibold border-b-2 border-green-400 pb-1"
      : "text-slate-400 hover:text-slate-100 transition-colors duration-200";

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-slate-100 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-green-500" />
            <h1 className="font-bold text-xl tracking-wide">
              {user.role === 'inspector' ? 'AdminPortal' : 'FarmPortal'}
            </h1>
          </div>
          <div className="flex items-center space-x-8">
            {user.role === 'inspector' ? (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>
                  Overview
                </NavLink>
                <NavLink to="/admin/farms" className={linkClass}>
                  Farms
                </NavLink>
                <NavLink to="/admin/unsafe" className={linkClass}>
                  Risk Monitor
                </NavLink>
                <NavLink to="/admin/notifications" className={linkClass}>
                  Notifications
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/animals" className={linkClass}>
                  Animals
                </NavLink>
                <NavLink to="/add-animal" className={linkClass}>
                  Add Animal
                </NavLink>
                <NavLink to="/add-medicine" className={linkClass}>
                  Add Medicine
                </NavLink>
              </>
            )}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-green-400 font-bold border border-slate-600">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                        {user.name}
                    </span>
                </div>
                <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tractor, ShieldCheck, User, X } from "lucide-react";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState("farmer"); // 'farmer' or 'admin'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    farmLocation: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    const role = loginType === "admin" ? "inspector" : "farmer";
    
    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        // Enforce role check for Admin login
        if (loginType === 'admin' && res.role !== 'inspector') {
            setError("Access Denied: This account is not an Admin.");
            // Optional: logout immediately if the context state was set
            return;
        }

        if (res.role === 'inspector') {
            navigate("/admin/dashboard");
        } else {
            navigate("/dashboard");
        }
      } else {
        setError(res.message);
      }
    } else {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        farmName: formData.farmName,
        farmLocation: formData.farmLocation,
      });
      if (res.success) {
        if (role === 'inspector') {
            navigate("/admin/dashboard");
        } else {
            navigate("/dashboard");
        }
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        
        {/* Login Type Toggle */}
        <div className="flex mb-8 bg-slate-700 p-1 rounded-lg">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
              loginType === "farmer"
                ? "bg-slate-600 text-green-400 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setLoginType("farmer"); setIsLogin(true); setError(""); }}
          >
            <User className="w-4 h-4" />
            Farmer
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
              loginType === "admin"
                ? "bg-slate-600 text-blue-400 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setLoginType("admin"); setIsLogin(true); setError(""); }}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className={`p-3 rounded-full mb-4 ${loginType === 'admin' ? 'bg-blue-900/30' : 'bg-green-900/30'}`}>
            {loginType === 'admin' ? (
                <ShieldCheck className={`w-8 h-8 ${loginType === 'admin' ? 'text-blue-500' : 'text-green-500'}`} />
            ) : (
                <Tractor className={`w-8 h-8 ${loginType === 'admin' ? 'text-blue-500' : 'text-green-500'}`} />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-100">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-400 mt-2">
            {loginType === 'admin' 
                ? "Admin Portal Login" 
                : (isLogin ? "Farmer Portal Login" : "Register your Farm")}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              {loginType === 'farmer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      placeholder="Green Valley Farm"
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="farmLocation"
                      value={formData.farmLocation}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-2"
          >
            {isLogin ? "Sign In" : "Register"}
          </button>

          {loginType !== 'admin' && (
            <div className="text-center mt-4">
                <button
                onClick={toggleLoginMode}
                className="text-green-400 hover:text-green-300 font-medium text-sm"
                >
                {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

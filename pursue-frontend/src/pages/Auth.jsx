import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(form.email, form.password);

      if (data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Registration successful. Please login.");
      setActiveTab("login");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl text-xl">
            🏢
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">
          Pursue Co-working Space
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Office Management System
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-2 rounded-lg font-medium ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`w-1/2 py-2 rounded-lg font-medium ${
              activeTab === "register"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* ================= FORMS ================= */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                value={form.name}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                required
                minLength={6}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-blue-500"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

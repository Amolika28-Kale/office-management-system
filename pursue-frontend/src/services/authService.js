import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = "https://office-management-system-muks.onrender.com/api";

/* ---------------- LOGIN ---------------- */
export const login = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, {
    email,
    password,
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data; // { token, role, user }
};

/* ---------------- REGISTER (USER) ---------------- */
export const register = async (data) => {
  // data = { name, email, password }
  const res = await axios.post(`${API}/auth/register`, data);
  return res.data;
};

/* ---------------- LOGOUT ---------------- */
export const logout = () => {
  localStorage.removeItem("token");
};

/* ---------------- CURRENT USER ---------------- */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token); // { id, role, iat, exp }
  } catch (err) {
    localStorage.removeItem("token");
    return null;
  }
};

/* ---------------- AUTH HEADER ---------------- */
export const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

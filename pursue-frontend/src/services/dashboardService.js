import axios from "axios";

const API = "http://localhost:5000/api/admin/dashboard";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchDashboardStats = () =>
  axios.get(API, authHeader());


export const fetchDashboardAnalytics = () =>
  axios.get(`${API}/analytics`, authHeader());

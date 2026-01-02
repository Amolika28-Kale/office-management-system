import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/dashboard";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* DASHBOARD STATS */
export const fetchDashboardStats = () =>
  axios.get(`${API}/stats`, authHeader());

/* DASHBOARD ANALYTICS */
export const fetchDashboardAnalytics = (params = {}) =>
  axios.get(`${API}/analytics`, {
    ...authHeader(),
    params,
  });

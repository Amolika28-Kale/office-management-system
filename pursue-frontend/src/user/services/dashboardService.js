import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/user/dashboard";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/stats`, authHeader());
  return res.data.data;
};

export const getActiveBookings = async () => {
  const res = await axios.get(`${API}/active-bookings`, authHeader());
  return res.data.data;
};
export const getUserDashboardAnalytics = async (params) => {
  const res = await axios.get(`${API}/analytics`, {
    ...authHeader(),
    params,
  });
  return res.data.data;
}
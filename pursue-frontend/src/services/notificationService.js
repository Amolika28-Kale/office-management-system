import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/notifications";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchNotifications = () =>
  axios.get(API, auth()).then(res => res.data.data);

export const markRead = (id) =>
  axios.patch(`${API}/${id}/read`, {}, auth());

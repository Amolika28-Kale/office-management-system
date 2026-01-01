import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/bookings";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchBookings = (params = {}) =>
  axios.get(API, { ...authHeader(), params });

export const getBookingById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

export const createBooking = (data) =>
  axios.post(API, data, authHeader());

export const updateBookingStatus = (id, data) =>
  axios.patch(`${API}/${id}/status`, data, authHeader());

export const cancelBooking = (id) =>
  axios.patch(`${API}/${id}/cancel`, {}, authHeader());

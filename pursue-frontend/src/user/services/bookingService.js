import axios from "axios";

const API = "http://localhost:5000/api/user/bookings";

const getToken = () => localStorage.getItem("token");

export const getMyBookings = async () => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const createBooking = async (data) => {
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const deleteBooking = async (id) => {
  return axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

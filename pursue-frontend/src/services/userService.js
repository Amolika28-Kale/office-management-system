import axios from "axios";

const API = "http://localhost:5000/api/admin/users";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchUsers = () =>
  axios.get(API, authHeader());

export const fetchUserStats = () =>
  axios.get(`${API}/stats`, authHeader());

export const createUser = (data) =>
  axios.post(API, data, authHeader());

export const updateUser = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

export const deleteUser = (id) =>
  axios.delete(`${API}/${id}`, authHeader());

export const getUserById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

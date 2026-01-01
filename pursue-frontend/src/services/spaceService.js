import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/spaces";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchSpaces = (params = {}) =>
  axios.get(API, { ...authHeader(), params });

export const getSpaceById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

export const createSpace = (data) =>
  axios.post(API, data, authHeader());

export const updateSpace = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

export const deleteSpace = (id) =>
  axios.delete(`${API}/${id}`, authHeader());

export const toggleSpaceStatus = (id) =>
  axios.patch(`${API}/${id}/toggle-status`, {}, authHeader());

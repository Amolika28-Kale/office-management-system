import axios from "axios";

const API = "http://localhost:5000/api/admin/leads";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchLeads = (params = {}) =>
  axios.get(API, { ...authHeader(), params });

export const getLeadById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

export const createLead = (data) =>
  axios.post(API, data, authHeader());

export const updateLead = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

export const deleteLead = (id) =>
  axios.delete(`${API}/${id}`, authHeader());

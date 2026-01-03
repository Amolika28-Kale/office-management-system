import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/branches";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


export const fetchBranches = () =>
  axios.get(API, auth()).then(res => res.data);

export const getBranchById = (id) =>
  axios.get(`${API}/${id}`, auth()).then(res => res.data);

export const createBranch = (data) =>
  axios.post(API, data, auth()).then(res => res.data);

export const updateBranch = (id, data) =>
  axios.put(`${API}/${id}`, data, auth()).then(res => res.data);

export const deleteBranch = (id) =>
  axios.delete(`${API}/${id}`, auth()).then(res => res.data);

import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/inventory";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* GET ALL INVENTORY */
export const getInventory = () =>
  axios.get(API, authHeader());

/* GET SINGLE ITEM */
export const getInventoryById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

/* CREATE ITEM */
export const createInventory = (data) =>
  axios.post(API, data, authHeader());

/* UPDATE ITEM */
export const updateInventory = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

/* DELETE ITEM */
export const deleteInventory = (id) =>
  axios.delete(`${API}/${id}`, authHeader());

/* LOW STOCK (Dashboard / Alert) */
export const getLowStock = () =>
  axios.get(`${API}/low-stock`, authHeader());

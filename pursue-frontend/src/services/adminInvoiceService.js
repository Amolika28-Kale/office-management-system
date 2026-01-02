import axios from "axios";

const API =
  "https://office-management-system-muks.onrender.com/api/admin/invoices";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* GET ALL INVOICES */
export const fetchInvoices = (params = {}) =>
  axios.get(API, { ...authHeader(), params });

/* GET INVOICE BY ID (VIEW) */
export const getInvoiceById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

/* DOWNLOAD INVOICE PDF */
export const downloadInvoice = (id) =>
  axios.get(`${API}/${id}/download`, {
    ...authHeader(),
    responseType: "blob",
  });

/* EMAIL INVOICE */
export const emailInvoice = (id) =>
  axios.post(`${API}/${id}/email`, {}, authHeader());

/* GENERATE NEW INVOICE PDF */
export const generateNewInvoice = () =>
  axios.get(`${API}/generate`, {
    ...authHeader(),
    responseType: "blob",
  });

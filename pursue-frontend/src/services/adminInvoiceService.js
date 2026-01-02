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

/* GET INVOICE BY ID */
export const getInvoiceById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

/* DOWNLOAD INVOICE (future PDF support) */
export const downloadInvoice = (id) =>
  axios.get(`${API}/${id}/download`, {
    ...authHeader(),
    responseType: "blob",
  });

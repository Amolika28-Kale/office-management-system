import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/user/invoices";

const token = () => localStorage.getItem("token");

export const getMyInvoices = async () => {
  const res = await axios.get(`${API}/my`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });
  return res.data;
};

export const getInvoiceById = async (id) => {
  const res = await axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data; // ✅ already invoice object
};


export const downloadInvoicePDF = async (id) => {
  const res = await axios.get(`${API}/${id}/pdf`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token()}` },
  });

  return res.data;
};

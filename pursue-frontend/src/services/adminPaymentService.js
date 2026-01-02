import axios from "axios";

const API =
  "https://office-management-system-muks.onrender.com/api/admin/payments";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* GET ALL PAYMENTS */
export const fetchPayments = (params = {}) =>
  axios.get(API, { ...authHeader(), params });

/* GET PAYMENT BY ID */
export const getPaymentById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

/* UPDATE PAYMENT STATUS (optional – if admin approves/refunds later) */
export const updatePaymentStatus = (id, data) =>
  axios.patch(`${API}/${id}/status`, data, authHeader());

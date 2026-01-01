import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/user/payments";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUserPayments = () =>
  axios.get(`${API}/my`, authHeader());

export const getPaymentStats = () =>
  axios.get(`${API}/stats`, authHeader());

export const createStripePaymentIntent = (data) =>
  axios.post(`${API}/stripe/create-intent`, data, authHeader());

export const confirmStripePayment = (paymentId) =>
  axios.post(
    `${API}/stripe/confirm`,
    { paymentId },
    authHeader()
  );

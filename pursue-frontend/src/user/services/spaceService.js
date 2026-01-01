import axios from "axios";

const API = "http://localhost:5000/api/user/spaces";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/**
 * Get all ACTIVE spaces (default)
 * Filters supported:
 *  - type: cabin | desk | conference
 *  - fromDate, toDate (optional – for availability later)
 */
export const fetchSpaces = (params = {}) =>
  axios.get(API, {
    ...authHeader(),
    params,
  });

/**
 * Get single space details
 * (only if active)
 */
export const getSpaceById = (id) =>
  axios.get(`${API}/${id}`, authHeader());

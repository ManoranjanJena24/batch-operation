import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { Accept: "application/json" }
});

export async function fetchBatches(params, signal) {
  const response = await api.get("/batches", { params, signal });
  return response.data;
}

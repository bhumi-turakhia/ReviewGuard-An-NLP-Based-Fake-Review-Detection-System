import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5010/api",
});

export default api;

// ✅ API function
export const predictReview = (text, model) => {
  return api.post("/predict", { text, model });
};

export const getStats = () => {
  return api.get("/stats");
};

// Interceptors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
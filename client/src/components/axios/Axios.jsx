import axios from "axios";
import { API_BASE_URL } from "../../config/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api/v1/",
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

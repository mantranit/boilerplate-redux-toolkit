import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
});

instance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token") || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const http = instance;

export default http;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8500/api/v1";

const api = {
  async request(url, options = {}) {
    const token = localStorage.getItem("accessToken");

    const config = {
      method: "GET",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !url.includes("/refresh")) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request with new token
            const newToken = localStorage.getItem("accessToken");
            config.headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        }
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async refresh() {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  post(url, reqBody) {
    return this.request(`${API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  },

  get(url, options = {}) {
    let fullUrl = `${API_URL}${url}`;
    // Handle query params
    if (options.params && typeof options.params === "object") {
      const query = new URLSearchParams(options.params).toString();
      if (query) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + query;
      }
    }
    // Remove params from options before passing to request
    const { params, ...rest } = options;
    return this.request(fullUrl, { method: "GET", ...rest });
  },
};

// const api1 = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle response errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (userData) => api.post("/auth/login", userData),
  getCurrentUser: () => api.get("/users"),
};

export const userAPI = {
  profile: () => api.get("users"),
  allUsers: () => api.get("users/get-all-users"),
};

export const quizAPI = {
  createQuiz: (quizData) => api.post("/quizzes/create-quiz", quizData),
  getAllQuizzes: (params) => api.get("/quizzes/all-quizzes", { params }),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  getUserQuizzes: () => api.get("/quizzes/my-quizzes"),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

export const resultAPI = {
  submitResult: (resultData) => api.post("/results", resultData),
  getUserResults: () => api.get("/results/my-results"),
  getResultById: (id) => api.get(`/results/${id}`),
};

export default api;

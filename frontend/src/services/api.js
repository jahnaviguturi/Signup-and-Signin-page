import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => localStorage.removeItem('user'),
};

export const courseService = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (courseId) => api.post('/enroll', { courseId }),
  getEnrollmentStatus: (courseId) => api.get(`/enroll/status/${courseId}`),
};

export const progressService = {
  completeLesson: (courseId, lessonId) => api.post('/progress/complete', { courseId, lessonId }),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  resumeLastWatched: (courseId) => api.get(`/progress/resume/${courseId}`),
};

export default api;

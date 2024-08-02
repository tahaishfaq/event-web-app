import axios from 'axios';



const axiosInstance = axios.create({
baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     if (error.response) {
//       const { status, data } = error.response;
//       switch (status) {
//         case 401:
//           toast.error('Unauthorized. Please login again.');
//           // Implement logout if needed
//           // useAuth().logout();
//           break;
//         case 403:
//           toast.error('Forbidden. You do not have permission to perform this action.');
//           break;
//         case 404:
//           toast.error('Resource not found.');
//           break;
//         case 500:
//           toast.error('Internal server error. Please try again later.');
//           break;
//         default:
//           toast.error(data.message || 'An error occurred. Please try again.');
//       }
//     } else {
//       toast.error('Network error. Please check your internet connection.');
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

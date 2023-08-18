import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://lunar-backend.vercel.app/',
});

export default axiosInstance;

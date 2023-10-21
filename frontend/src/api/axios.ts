import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  console.log(accessToken)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
})

export const handleError = (error: AxiosError): string => {
  if (error?.response?.data) {
    const responseData: Record<string, any> = error.response.data;

    if (responseData.message) {
      return responseData.message;
    } else {
      let errorMessage: string = '';
      for (const key in responseData) {
        // Check if there are error messages for this property
        if (Array.isArray(responseData[key]) && responseData[key].length > 0) {
          errorMessage = `${key}: ${responseData[key][0]}`;
          break; // Stop iterating after the first error message is found
        }
      }
      return errorMessage || 'An error occurred. Please try again later.';
    }
  } else {
    return 'An error occurred. Please try again later.';
  }
};

export default axiosInstance;

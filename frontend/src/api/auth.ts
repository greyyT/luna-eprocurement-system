import axios from 'axios';
import axiosInstance from './axios';

export const signIn = async (
  email: string,
  password: string,
  setError?: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >,
) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });

    return response.data.accessToken;
  } catch (err) {
    if (!setError) {
      console.log(err);
      return;
    }
    if (axios.isAxiosError(err)) {
      if (err.response) {
        setError({
          email: err.response.data.message,
          password: err.response.data.message,
        });
      } else {
        setError({
          email: 'Internal server error',
          password: 'Internal server error',
        });
      }
    }
  }
};

export const signUp = async (
  email: string,
  username: string,
  password: string,
  setError: React.Dispatch<
    React.SetStateAction<{
      email: string;
      name: string;
      password: string;
    }>
  >,
) => {
  try {
    await axiosInstance.post('/auth/register', { email, username, password });

    return true;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        setError({
          email: err.response.data.message,
          name: err.response.data.message,
          password: err.response.data.message,
        });
      } else {
        setError({
          email: 'Internal server error',
          name: 'Internal server error',
          password: 'Internal server error',
        });
      }
    }
  }
};

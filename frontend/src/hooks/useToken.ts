import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');

    if (!tokenString) return null;

    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: string) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  const deleteToken = () => {
    localStorage.removeItem('token');
  };

  return {
    setToken: saveToken,
    token,
    deleteToken,
  };
}

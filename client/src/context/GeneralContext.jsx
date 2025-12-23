import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {

  const BASE_URL = "http://localhost:6001";

  // Socket
  const socket = socketIoClient(BASE_URL);

  const navigate = useNavigate();

  // Auth states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  /* ========================= LOGIN ========================= */
  const login = async () => {
    try {
      const loginInputs = { email, password };

      const res = await axios.post(`${BASE_URL}/login`, loginInputs);

      // Save session
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      // Redirect based on role
      if (res.data.usertype === 'freelancer') {
        navigate('/freelancer');
      } else if (res.data.usertype === 'client') {
        navigate('/client');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  /* ========================= REGISTER ========================= */
  const register = async () => {
    try {
      const inputs = {
        username,
        email,
        password,
        usertype
      };

      const res = await axios.post(`${BASE_URL}/register`, inputs);

      // Save session
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      // Redirect based on role
      if (res.data.usertype === 'freelancer') {
        navigate('/freelancer');
      } else if (res.data.usertype === 'client') {
        navigate('/client');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }

    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Registration failed"
      );
    }
  };

  /* ========================= LOGOUT ========================= */
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        socket,
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;

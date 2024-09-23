import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      axiosInstance.get(`/users/profile/${localStorage.userId}`).then((res) => {
        console.log("user-profile", res?.data);
        setUser(res.data);
        setTotalEarnings(res.data.total_earnings);
      });
    } catch (error) {
      console.error(error);
    }
    // if (localStorage.getItem("event_user")) {
    //   const storedUser = JSON.parse(localStorage.getItem("event_user"));
    //   console.log("user", storedUser);
    //   setUser(storedUser);
    //   setToken(localStorage.getItem("authToken"));

    // }
  }, [localStorage]);

  // const register = async (values) => {

  // };

  // const login = async (values) => {

  // };

  const logout = () => {
    localStorage.setItem("authToken", "");
    localStorage.removeItem("userId");
    localStorage.setItem("isLoggedIn", "false");
    setUser(null);
    setToken("");
  };

  const updateProfile = async (data) => {
    try {
      await axiosInstance.put("/users/update-profile", data).then((res) => {
        console.log("udpate-profile", res?.data.user);
        setUser(res.data.user);
        // localStorage.setItem("userId", res?.data?.user?._id);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addBankAccount = async (data) => {
    try {
      const response = await axiosInstance.put(
        "/users/attach-bank-account",
        data
      );
      setUser(response.data.user);
      // localStorage.setItem("event_user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message);
    }
  };

  const requestWithdrawal = async (data) => {
    try {
      const response = await axiosInstance.post("/users/withdraw", data);
      console.log("requestWithdrawl", response);
      setTotalEarnings(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        updateProfile,
        addBankAccount,
        totalEarnings,
        requestWithdrawal,
        token,
        setTotalEarnings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

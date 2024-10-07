import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/Homepage/HomePage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Events from "./pages/Events/Events";
import AddNewEvent from "./pages/Events/AddNewEvent";
import EventDetails from "./pages/Events/EventDetails";
import VerifyPayment from "./pages/Events/VerifyPayment";
import MyTickets from "./pages/MyTickets/MyTickets";
import { useEffect, useState } from "react";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import UserProfile from "./pages/UpdateProfile/UserProfile";
import { useAuth } from "./context/AuthContext";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";

function App() {
  const { setUser, user } = useAuth();
  useEffect(() => {
    const fetchUser = () => {
      try {
        axiosInstance
          .get(`/users/profile/${localStorage.userId}`)
          .then((res) => {
            console.log("user-profile", res?.data);
            setUser(res.data);
          });
      } catch (error) {
        console.error(error);
      }
    };

    if (localStorage.token && localStorage.userId) {
      fetchUser();
    }
  }, [localStorage]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        {/* <Route path="/homepage" element={<HomePage />} /> */}
        <Route path="/events" element={<Events />} />
        <Route path="/add-event" element={<AddNewEvent />} />
        <Route path="/single-event/:id" element={<EventDetails />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/show-profile" element={<UpdateProfile />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        <Route path="/" element={user ? <Events /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;

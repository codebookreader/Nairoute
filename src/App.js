import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Driver from './Driver';
import Home from './homepage';
import Login from './Login';
import DriverLogin from './DriverLogin';
import Resetpassword from './Resetpassword';
import Dashboard from './Dashboard';
import Services from './Services';
import LockScreen from './lockscreen';
import OtpPage from './OtpPage';
import PlaceSearch from './placesearch';
import Adminpage from './Management/Adminpage';
import Statistics from './Management/Statistics';
import ManageCommuters from './Management/ManageCommuters';
import ManageDrivers from './Management/ManageDrivers';
import BookingForm from './seatpick';
import SeatSelection from './seatselection';
import AdminLogin from './Management/AdminLogin';
import DriverEarnings from './Tables/DriverEarnings';
import ErrorPage from './errorpage';


function App() {
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setIsLocked(true), 60000); // 60000 ms = 1 minute
    };

    // Set up event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Start the inactivity timer
    resetTimer();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setIsLocked(true), 60000); // Reset timer on unlock
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/driverregister" element={<Driver/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/driverlogin" element={<DriverLogin />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lockscreen" element={<LockScreen />} />
          <Route path="/services" element={<Services/>}/>
          <Route path="/otppage" element={<OtpPage/>}/>
          <Route path="/placesearch" element={<PlaceSearch/>}/>
          <Route path="/adminpage" element={<Adminpage/>}/>
          <Route path="/statistics" element={<Statistics/>}/>
          <Route path="/managecommuters" element={<ManageCommuters/>}/>
          <Route path="/managedrivers" element={<ManageDrivers/>}/>
          <Route path="/bookingform" element={<BookingForm/>}/>
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/adminlogin" element={<AdminLogin/>}/>
          <Route path="/earnings" element={<DriverEarnings />} />
          <Route path="/error" element={<ErrorPage />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;

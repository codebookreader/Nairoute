import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Home from './homepage';
import Login from './Login';
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



function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setTimer(setTimeout(() => setIsLocked(true), 60000)); // 60000 ms = 1 minute
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
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const handleUnlock = () => {
    setIsLocked(false);
    setTimer(setTimeout(() => setIsLocked(true), 60000)); // Reset timer on unlock
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
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


          </Routes>
        
      </div>
    </Router>
  );
}

export default App;
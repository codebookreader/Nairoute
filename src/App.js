import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Home from './homepage';
import Login from './Login';
import Resetpassword from './Resetpassword';
import Dashboard from './Dashboard';
import LockScreen from './lockscreen';
import OtpVerification from './OtpVerification';
import OtpPage from './OtpPage';
import PlaceSearch from './placesearch';


function App() {
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
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/otppage" element={<OtpPage />} />
          <Route path="/placesearch" element={<PlaceSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
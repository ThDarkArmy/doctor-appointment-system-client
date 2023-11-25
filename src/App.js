import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import RegisterAdmin from "./pages/RegisterAdmin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/doctor-dashboard" element={<DoctorDashboard/>}/>
        <Route path="/patient-dashboard" element={<PatientDashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminPanel/>}/>
        <Route path="/register-admin" element={<RegisterAdmin/>}/>
      </Routes>
    </Router>
    <Footer/>
    </React.Fragment>
  );
}

export default App;

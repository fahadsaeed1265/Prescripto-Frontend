import React from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Doctors from './Pages/Doctors'
import Login from './Pages/Login'
import Contact from './Pages/Contact'
import Myprofile from './Pages/Myprofile'
import Myappointment from './Pages/Myappointment'
import Appointment from './Pages/Appointment'
import About from './Pages/About'
import Navbar from './Components/navbar'
import Footer from './Components/Footer'
import AddDoctor from './Pages/AddDoctor'
import DoctorDashboard from './Pages/DoctorDashboard'
import DoctorAppointments from './Pages/DoctorAppointments'
import DoctorList from './Pages/DoctorList'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import Chatbot from './Components/Chatbot'


const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token")
  return token ? element : <Navigate to="/login" />
}

const App = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/admin-login'

  return (
    <div className={isLoginPage ? '' : 'mx-4 sm:mx-[10%]'}>
      {!isLoginPage && <Navbar />}

      <Routes>

        {/* ── Default → Home ── */}
        <Route path='/' element={<Home />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Doctors' element={<Doctors />} />
        <Route path='/Doctors/:speciality' element={<Doctors />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />

        {/* ── Patient Routes (must be logged in) ── */}
        <Route path='/My-profile' element={<PrivateRoute element={<Myprofile />} />} />
        <Route path='/My-Appointments' element={<PrivateRoute element={<Myappointment />} />} />
        <Route path='/appointment/:docId' element={<PrivateRoute element={<Appointment />} />} />

        {/* ── Doctor Routes (must be logged in) ── */}
        <Route path='/doctor/dashboard' element={<PrivateRoute element={<DoctorDashboard />} />} />
        <Route path='/doctor/appointments' element={<PrivateRoute element={<DoctorAppointments />} />} />
        <Route path='/Doctor/profile' element={<PrivateRoute element={<AddDoctor />} />} />
        <Route path='/Doctor-List' element={<PrivateRoute element={<DoctorList />} />} />

      </Routes>

      {!isLoginPage && <Footer />}
            {!isLoginPage && <Chatbot />}

    </div>
  )
}

export default App
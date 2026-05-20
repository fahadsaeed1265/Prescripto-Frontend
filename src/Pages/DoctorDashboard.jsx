import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {

    const navigate = useNavigate()
    const name = localStorage.getItem("name")

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className='m-5'>
            {/* Header */}
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-2xl font-semibold'>
                    Welcome, Dr. {name} 👋
                </h1>
                <button
                    onClick={logout}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg'>
                    Logout
                </button>
            </div>

            {/* Two Options */}
            <div className='flex gap-6'>

                {/* Card 1 — My Profile */}
                <div
                    onClick={() => navigate('/doctor/profile')}
                    className='border rounded-xl p-6 w-60 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all'>
                    <p className='text-4xl mb-3'>👨‍⚕️</p>
                    <p className='text-lg font-medium'>My Profile</p>
                    <p className='text-gray-400 text-sm mt-1'>
                        Add or update your details
                    </p>
                </div>

                {/* Card 2 — My Appointments */}
                <div
                    onClick={() => navigate('/doctor/appointments')}
                    className='border rounded-xl p-6 w-60 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all'>
                    <p className='text-4xl mb-3'>📅</p>
                    <p className='text-lg font-medium'>My Appointments</p>
                    <p className='text-gray-400 text-sm mt-1'>
                        See who booked you
                    </p>
                </div>

            </div>
        </div>
    )
}

export default DoctorDashboard
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const backendUrl = "https://localhost:7244"

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(
                backendUrl + "/api/appointments/my-appointments",
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            if (response.status === 401) {
                localStorage.clear()
                navigate('/login')
                return
            }
            const data = await response.json()
            setAppointments(data)
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch appointments", error)
            setLoading(false)
        }
    }

    // ── Mark as Completed ─────────────────────────
    const markCompleted = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(
                backendUrl + `/api/appointments/complete/${id}`,
                {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                }
            )
            const data = await response.json()
            if (data.success) {
                alert("✅ Marked as completed!")
                fetchAppointments()  // Refresh list
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    // ── Cancel Appointment ────────────────────────
    const cancelAppointment = async (id) => {

        // Ask doctor to confirm first
        const confirm = window.confirm(
            "Are you sure you want to cancel this appointment?"
        )
        if (!confirm) return

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(
                backendUrl + `/api/appointments/cancel/${id}`,
                {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                }
            )
            const data = await response.json()
            if (data.success) {
                alert("❌ Appointment cancelled!")
                fetchAppointments()  // Refresh list
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-60'>
                <p className='text-gray-400'>Loading appointments...</p>
            </div>
        )
    }

    return (
        <div className='m-5'>

            {/* Header */}
            <div className='flex items-center gap-4 mb-6'>
                <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className='text-indigo-500 hover:underline text-sm'>
                    ← Back to Dashboard
                </button>
                <h1 className='text-xl font-semibold'>My Appointments</h1>
            </div>

            {appointments.length === 0 ? (
                <div className='text-center py-20 text-gray-400'>
                    <p className='text-4xl mb-4'>📅</p>
                    <p>No appointments booked yet.</p>
                </div>
            ) : (
                <div className='bg-white border rounded-xl overflow-hidden'>

                    {/* Table Header */}
                    <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.5fr] py-3 px-6 bg-gray-50 border-b text-sm font-medium text-gray-500'>
                        <p>#</p>
                        <p>Patient</p>
                        <p>Date</p>
                        <p>Time</p>
                        <p>Fees</p>
                        <p>Status</p>
                        <p>Actions</p>
                    </div>

                    {/* Table Rows */}
                    {appointments.map((item, index) => (
                        <div
                            key={item.id}
                            className='grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.5fr] py-4 px-6 border-b hover:bg-gray-50 text-sm items-center'
                        >
                            {/* Number */}
                            <p className='text-gray-500'>{index + 1}</p>

                            {/* Patient Name */}
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center'>
                                    <p className='text-indigo-500 font-medium text-xs'>
                                        {item.patientName?.charAt(0).toUpperCase()}
                                    </p>
                                </div>
                                <p className='font-medium text-gray-800'>
                                    {item.patientName}
                                </p>
                            </div>

                            {/* Date */}
                            <p className='text-gray-600'>
                                {formatDate(item.slotDate)}
                            </p>

                            {/* Time */}
                            <p className='text-gray-600'>{item.slotTime}</p>

                            {/* Fees */}
                            <p className='text-gray-800 font-medium'>
                                Rs. {item.amount}
                            </p>

                            {/* Status Badge */}
                            <div>
                                {item.cancelled ? (
                                    <span className='bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs'>
                                        Cancelled
                                    </span>
                                ) : item.isCompleted ? (
                                    <span className='bg-green-100 text-green-500 px-3 py-1 rounded-full text-xs'>
                                        Completed
                                    </span>
                                ) : (
                                    <span className='bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-xs'>
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* 👇 Action Buttons */}
                            <div className='flex gap-2'>
                                {/* Only show buttons if still pending */}
                                {!item.cancelled && !item.isCompleted ? (
                                    <>
                                        <button
                                            onClick={() => markCompleted(item.id)}
                                            className='bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600'>
                                            ✓ Done
                                        </button>
                                        <button
                                            onClick={() => cancelAppointment(item.id)}
                                            className='bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600'>
                                            ✗ Cancel
                                        </button>
                                    </>
                                ) : (
                                    // No buttons if already completed or cancelled
                                    <p className='text-gray-300 text-xs'>No actions</p>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}

const formatDate = (slotDate) => {
    if (!slotDate) return ''
    const [day, month, year] = slotDate.split('_')
    const months = ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec']
    return `${day} ${months[parseInt(month) - 1]} ${year}`
}

export default DoctorAppointments
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Myappointment = () => {

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)  // 👈 tracks which appointment to pay
  const [paymentStep, setPaymentStep] = useState(1)  // 👈 step 1 = form, step 2 = success
  const [paymentLoading, setPaymentLoading] = useState(false)

  const navigate = useNavigate()
  const backendUrl = "https://localhost:7244"

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { navigate('/login'); return }

      const response = await fetch(
        backendUrl + "/api/appointments/patient-appointments",
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

  const cancelAppointment = async (id) => {
    const confirm = window.confirm("Cancel this appointment?")
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        backendUrl + `/api/appointments/cancel/${id}`,
        { method: "PUT", headers: { "Authorization": `Bearer ${token}` } }
      )
      const data = await response.json()
      if (data.success) {
        alert("Appointment cancelled!")
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // ── Easypaisa Payment Handler ──────────────────
  const handlePayment = async () => {
    setPaymentLoading(true)
    // Simulate a 2 second payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        backendUrl + `/api/appointments/pay/${selectedAppointment.id}`,
        { method: "PUT", headers: { "Authorization": `Bearer ${token}` } }
      )
      const data = await response.json()
      if (data.success) {
        setPaymentStep(2)       // show success screen
        fetchAppointments()     // refresh list in background
      } else {
        alert("Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Something went wrong.")
    } finally {
      setPaymentLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedAppointment(null)
    setPaymentStep(1)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const formatDate = (slotDate) => {
    if (!slotDate) return ''
    const [day, month, year] = slotDate.split('_')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${day} ${months[parseInt(month) - 1]} ${year}`
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-60'>
        <p className='text-gray-400'>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>
        My Appointments
      </p>

      {appointments.length === 0 ? (
        <div className='text-center py-20 text-gray-400'>
          <p className='text-4xl mb-4'>📅</p>
          <p>No appointments booked yet.</p>
          <button
            onClick={() => navigate('/Doctors')}
            className='mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full text-sm'>
            Book an Appointment
          </button>
        </div>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
              key={index}
            >
              {/* Doctor Image */}
              <div className='w-32 h-32 bg-indigo-50 rounded-lg overflow-hidden flex items-center justify-center'>
                {item.doctorImage ? (
                  <img
                    className='w-full h-full object-cover'
                    src={`data:image/jpeg;base64,${item.doctorImage}`}
                    alt={item.doctorName}
                  />
                ) : (
                  <p className='text-4xl font-bold text-indigo-400'>
                    {item.doctorName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>

              {/* Details */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold text-base'>
                  Dr. {item.doctorName}
                </p>
                <p className='text-zinc-400 text-xs'>{item.doctorSpeciality}</p>

                <div className='mt-2'>
                  {item.cancelled ? (
                    <span className='bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='bg-green-100 text-green-500 px-3 py-1 rounded-full text-xs'>
                      Completed
                    </span>
                  ) : item.paymentStatus ? (
                    <span className='bg-purple-100 text-purple-500 px-3 py-1 rounded-full text-xs'>
                      Paid
                    </span>
                  ) : (
                    <span className='bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-xs'>
                      Pending
                    </span>
                  )}
                </div>

                <p className='text-zinc-700 font-medium mt-2'>Date & Time:</p>
                <p className='text-xs mt-1'>
                  {formatDate(item.slotDate)} | {item.slotTime}
                </p>
                <p className='text-zinc-700 font-medium mt-2'>
                  Fees: <span className='text-indigo-500'>Rs. {item.amount}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && !item.isCompleted && (
                  <>
                    {/* 👇 Only show Pay Online if not already paid */}
                    {!item.paymentStatus ? (
                      <button
                        onClick={() => setSelectedAppointment(item)}
                        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-indigo-500 hover:text-white transition-all duration-300'>
                        Pay Online
                      </button>
                    ) : (
                      <button
                        disabled
                        className='text-sm text-center sm:min-w-48 py-2 border rounded bg-purple-50 text-purple-400 cursor-not-allowed'>
                        ✓ Payment Done
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(item.id)}
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'>
                      Cancel Appointment
                    </button>
                  </>
                )}
                {item.cancelled && (
                  <button
                    onClick={() => navigate('/Doctors')}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-indigo-500 hover:text-white transition-all duration-300'>
                    Book Again
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Easypaisa Payment Modal ───────────────── */}
      {selectedAppointment && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl w-full max-w-md p-6 relative'>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold'>
              ✕
            </button>

            {paymentStep === 1 ? (
              <>
                {/* Easypaisa Header */}
                <div className='flex items-center gap-3 mb-5'>
                  <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>EP</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>Easypaisa Payment</p>
                    <p className='text-xs text-gray-400'>Secure mobile payment</p>
                  </div>
                </div>

                {/* Appointment Summary */}
                <div className='bg-gray-50 rounded-xl p-4 mb-5'>
                  <p className='text-xs text-gray-400 mb-1'>Paying for</p>
                  <p className='font-semibold text-gray-800'>Dr. {selectedAppointment.doctorName}</p>
                  <p className='text-xs text-gray-500'>{selectedAppointment.doctorSpeciality}</p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {formatDate(selectedAppointment.slotDate)} | {selectedAppointment.slotTime}
                  </p>
                  <div className='mt-3 pt-3 border-t flex justify-between items-center'>
                    <p className='text-sm text-gray-600'>Amount</p>
                    <p className='font-bold text-green-600 text-lg'>Rs. {selectedAppointment.amount}</p>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className='mb-5'>
                  <label className='text-sm text-gray-600 font-medium block mb-1'>
                    Easypaisa Account Number
                  </label>
                  <input
                    type='tel'
                    placeholder='03XX-XXXXXXX'
                    maxLength={11}
                    className='w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400'
                  />
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className='w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-60'>
                  {paymentLoading ? 'Processing...' : `Pay Rs. ${selectedAppointment.amount}`}
                </button>
              </>
            ) : (
              /* ── Success Screen ── */
              <div className='text-center py-6'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-green-500 text-3xl'>✓</span>
                </div>
                <p className='text-xl font-bold text-gray-800 mb-1'>Payment Successful!</p>
                <p className='text-sm text-gray-500 mb-1'>Dr. {selectedAppointment.doctorName}</p>
                <p className='text-sm text-gray-500 mb-4'>Rs. {selectedAppointment.amount} paid via Easypaisa</p>
                <button
                  onClick={closeModal}
                  className='bg-indigo-500 text-white px-8 py-2 rounded-full text-sm hover:bg-indigo-600'>
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Myappointment
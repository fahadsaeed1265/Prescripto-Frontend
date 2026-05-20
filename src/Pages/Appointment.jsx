import React, { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/Appcontext'
import { assets } from '../assets/assets/assets_frontend/assets'
import RelatedDoctor from '../Components/RelatedDoctor'
import axios from 'axios'

const Appointment = () => {

const { docId } = useParams()
const { doctors, currencySymbol } = useContext(AppContext)
const navigate = useNavigate()

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const [docInfo, setDocInfo] = useState(null)
const [docSlots, setDocSlots] = useState([])
const [slotIndex, setSlotIndex] = useState(0)
const [slotTime, setSlotTime] = useState(null)
const [message, setMessage] = useState('')
const [bookedSlots, setBookedSlots] = useState([])

  // ── Fetch Doctor Info ──────────────────────────────
  const fetchDocInfo = () => {
    const info = doctors.find(doc => doc.id === Number(docId))
    setDocInfo(info)
  }

  // ── Fetch Already Booked Slots ─────────────────────
  const fetchBookedSlots = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `https://localhost:7244/api/appointments/booked-slots/${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBookedSlots(response.data)
    } catch (error) {
      console.error("Could not fetch booked slots", error)
    }
  }

  // ── Generate Available Slots ───────────────────────
  const getAvailableSlots = () => {
    let slots = []
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        )
        currentDate.setMinutes(0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let daySlots = []

      while (currentDate < endTime) {
        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const formattedDate = `${day}_${month}_${year}`
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        const slotKey = `${formattedDate}_${formattedTime}`
        const isBooked = bookedSlots.includes(slotKey)

        if (!isBooked) {
          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            slotDate: formattedDate
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      slots.push(daySlots)
    }

    setDocSlots(slots)
  }

  // ── Book Appointment ───────────────────────────────
  const bookAppointment = async (paymentStatus = "Pending") => {
    if (!slotTime) {
        setMessage("Please select a time slot.")
        return
    }

    const token = localStorage.getItem('token')
    if (!token) {
        setMessage("⚠️ Please login to book an appointment.")
        return
    }

    try {
        const day = slotTime.datetime.getDate()
        const month = slotTime.datetime.getMonth() + 1
        const year = slotTime.datetime.getFullYear()
        const formattedSlotDate = `${day}_${month}_${year}`

        const payload = {
            docId: docId,
            slotDate: formattedSlotDate,
            slotTime: slotTime.time,
            paymentStatus: paymentStatus
        }

        const response = await axios.post(
            "https://localhost:7244/api/appointments/book",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
            setMessage("✅ Appointment booked! Please pay the fee from My Appointments.")
            fetchBookedSlots()
            setSlotTime(null)
        } else {
            setMessage("❌ " + response.data.message)
        }

    } catch (error) {
        console.error("Booking Error:", error)
        setMessage("Something went wrong. Please try again.")
    }
  }

  // ── Effects ────────────────────────────────────────
  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      fetchBookedSlots()
    }
  }, [docInfo])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo, bookedSlots])

  // ── UI ─────────────────────────────────────────────
  if (!docInfo) {
    return (
      <div className='flex justify-center items-center h-60'>
        <p className='text-gray-400'>Loading doctor information...</p>
      </div>
    )
  }

  return (
    <div>
      {/* ── Doctor Details ── */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-indigo-600 w-full sm:max-w-72 rounded-lg'
            src={
              docInfo.image
                ? `data:image/jpeg;base64,${docInfo.image}`
                : '/default-doctor.png'
            }
            alt={docInfo.name}
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 bg-white'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          <p className='text-sm text-gray-500 mt-3'>{docInfo.about}</p>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:{' '}
            <span className='text-gray-600'>
              {currencySymbol} {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ── Booking Section ── */}
      <div className='sm:ml-72 sm:pl-4 mt-6'>
        <p className='font-medium text-gray-700'>Booking Slots</p>

        {/* Days Row */}
        <div className='flex gap-3 mt-4 overflow-x-scroll'>
          {docSlots.map((day, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer
                ${slotIndex === index
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-200'
                }`}
            >
              <p>{day[0] && daysOfWeek[day[0].datetime.getDay()]}</p>
              <p>{day[0] && day[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time Slots Row */}
        <div className='flex gap-3 mt-4 overflow-x-scroll'>
          {docSlots[slotIndex]?.length > 0
            ? docSlots[slotIndex].map((slot, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(slot)}
                  className={`text-sm px-5 py-2 rounded-full cursor-pointer
                    ${slotTime?.time === slot.time && slotTime?.slotDate === slot.slotDate
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-400 border border-gray-300'
                    }`}
                >
                  {slot.time.toLowerCase()}
                </p>
              ))
            : <p className='text-gray-400 text-sm'>
                No slots available for this day
              </p>
          }
        </div>

        {/* Book Button */}
        <button
            onClick={() => bookAppointment()}
            className='bg-indigo-600 text-white text-sm px-14 py-3 rounded-full my-6 cursor-pointer'
        >
            Book an appointment
        </button>

        {/* Message */}
        {message &&
          <p className={`text-sm mt-2 ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        }
      </div>

      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
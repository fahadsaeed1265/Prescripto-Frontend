import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()
  const [doctors, setDoctors] = useState([])
  const [filterDoc, setFilterDoc] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ── STEP 1: Fetch doctors from backend ──────────────
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // 👇 No token needed — doctors are public
        const response = await fetch("https://localhost:7244/api/doctors")

        const data = await response.json()
        setDoctors(data)
        setLoading(false)

      } catch (error) {
        console.error("Failed to fetch doctors", error)
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // ── STEP 2: Filter by speciality when URL changes ───
  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }, [doctors, speciality])

  // ── STEP 3: Show loading while fetching ─────────────
  if (loading) {
    return (
      <div className='flex justify-center items-center h-60'>
        <p className='text-gray-400'>Loading doctors...</p>
      </div>
    )
  }

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* ── Left Side: Speciality Filter Buttons ── */}
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate('/Doctors')
                  : navigate(`/Doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer
                ${speciality === spec ? "bg-indigo-100 text-black border-indigo-400" : "hover:bg-gray-50"}`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* ── Right Side: Doctors Grid ── */}
        <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>

          {filterDoc.length === 0 && (
            <p className='text-gray-400 col-span-full mt-4'>
              No doctors found.
            </p>
          )}

          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item.id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img
                className='bg-blue-50 w-full h-48 object-cover'
                src={
                  item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : '/default-doctor.png'
                }
                alt={item.name}
              />

              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                  <p>Available</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                <p className='text-indigo-500 text-sm mt-1'>Rs. {item.fees}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default Doctors
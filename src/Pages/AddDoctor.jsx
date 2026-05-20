import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets/assets_admin/assets'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(null)
    const [existingImage, setExistingImage] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [isExisting, setIsExisting] = useState(false)
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem("token")

    // ✅ Load existing profile when page opens
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "https://localhost:7244/api/doctors/my-profile",
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const d = res.data
                setName(d.name || '')
                setEmail(d.email || '')
                setExperience(d.experience || '1 Year')
                setFees(d.fees || '')
                setAbout(d.about || '')
                setSpeciality(d.speciality || 'General physician')
                setDegree(d.degree || '')
                setAddress1(d.address1 || '')
                setAddress2(d.address2 || '')
                setStatus(d.status || '')
                setIsExisting(true)
                if (d.image) {
                    setExistingImage(`data:image/jpeg;base64,${d.image}`)
                }
            } catch (err) {
                // No profile yet — fresh form
                setIsExisting(false)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const onsubmithandler = async (event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("Name", name)
        formData.append("Email", email)
        formData.append("Experience", experience)
        formData.append("Fees", fees)
        formData.append("About", about)
        formData.append("Speciality", speciality)
        formData.append("Degree", degree)
        formData.append("Address1", address1)
        formData.append("Address2", address2)
        if (docImg) {
            formData.append("ImageFile", docImg)
        }

        try {
            await axios.post(
                "https://localhost:7244/api/doctors",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    },
                }
            )
            if (isExisting) {
                alert("Profile updated successfully!")
            } else {
                alert("Profile submitted! Please wait for admin approval.")
            }
        } catch (error) {
                const msg = error.response?.data
    alert("Error: " + JSON.stringify(msg))

            alert("Error saving profile")
        }
    }

    if (loading) {
        return <div className="m-5 text-gray-500">Loading your profile...</div>
    }

    return (
        <form onSubmit={onsubmithandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>
                {isExisting ? 'Update Profile' : 'Add Doctor'}
            </p>

            {/* Status Banner */}
            {status === 'Pending' && (
                <div className='mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded'>
                    ⏳ Your profile is under review. Please wait for admin approval.
                </div>
            )}
            {status === 'Approved' && (
                <div className='mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
                    ✅ Your profile is approved. You are visible to patients.
                </div>
            )}
            {status === 'Rejected' && (
                <div className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    ❌ Your profile was rejected. Please update your details and resubmit.
                </div>
            )}

            <div className='bg-gray-50 px-8 py-8 border-rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img
                            className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover'
                            src={
                                docImg
                                    ? URL.createObjectURL(docImg)
                                    : existingImage || assets.upload_area
                            }
                            alt=""
                        />
                    </label>
                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file"
                        id="doc-img"
                        hidden
                    />
                    <p>Upload Doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-500'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2'>
                                <option>1 Year</option>
                                <option>2 Year</option>
                                <option>3 Year</option>
                                <option>4 Year</option>
                                <option>5 Year</option>
                                <option>6 Year</option>
                                <option>7 Year</option>
                                <option>8 Year</option>
                                <option>9 Year</option>
                                <option>10 Year</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2'>
                                <option>General physician</option>
                                <option>Gynecologist</option>
                                <option>Dermatologist</option>
                                <option>Pediatricians</option>
                                <option>Neurologist</option>
                                <option>Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>
                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p className='mt-4 mb-2'>About</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write about yourself' rows={5} required />
                </div>

                <button type="submit" className='bg-indigo-500 px-8 py-3 mt-4 text-white rounded-full cursor-pointer'>
                    {isExisting ? 'Update Profile' : 'Submit Profile'}
                </button>
            </div>
        </form>
    )
}

export default AddDoctor
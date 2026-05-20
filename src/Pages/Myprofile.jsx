import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const Myprofile = () => {

  const [userData, setUserData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState(null)    // 👈 New image file
  const [imagePreview, setImagePreview] = useState(null) // 👈 Preview before save
  const backendUrl = "https://localhost:7244"

  // ── Load Profile ──────────────────────────────────
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(backendUrl + "/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await response.json()

      setUserData({
        name:     data.name     || "",
        email:    data.email    || "",
        phone:    data.phone    || "",
        gender:   data.gender   || "Male",
        dob:      data.dob      || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        image:    data.image    // base64 from backend
      })
      setLoading(false)

    } catch (error) {
      console.error("Failed to load profile", error)
      setLoading(false)
    }
  }

  // ── Handle Image Change ───────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Show preview immediately
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // ── Save Profile ──────────────────────────────────
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token")

      // Use FormData because we might send an image file
      const formData = new FormData()
      formData.append("Name",     userData.name)
      formData.append("Phone",    userData.phone    || "")
      formData.append("Gender",   userData.gender   || "")
      formData.append("Dob",      userData.dob      || "")
      formData.append("Address1", userData.address1 || "")
      formData.append("Address2", userData.address2 || "")

      // 👇 Add image only if new one selected
      if (imageFile) {
        formData.append("ImageFile", imageFile)
      }

      const response = await fetch(backendUrl + "/api/user/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
          // Don't set Content-Type for FormData!
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ Profile updated successfully!")
        setIsEdit(false)
        setImageFile(null)
        fetchProfile()  // Reload to show updated data
      }

    } catch (error) {
      console.error("Failed to save", error)
      alert("Failed to save. Try again.")
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-60'>
        <p className='text-gray-400'>Loading profile...</p>
      </div>
    )
  }

  if (!userData) {
    return <p className='text-red-400'>Could not load profile.</p>
  }

  // ── Decide which image to show ────────────────────
  const displayImage = imagePreview
    ? imagePreview                                        // New selected image
    : userData.image
      ? `data:image/jpeg;base64,${userData.image}`       // Saved image from DB
      : assets.profile_pic                               // Default image

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

      {/* Profile Image */}
      <div className='relative w-36'>
        <img
          className='w-36 h-36 rounded-full object-cover border-2 border-indigo-200'
          src={displayImage}
          alt="Profile"
        />
        {/* 👇 Show upload button only in edit mode */}
        {isEdit && (
          <label
            htmlFor="profile-image"
            className='absolute bottom-0 right-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-indigo-600'>
            📷 Change
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Name */}
      {isEdit
        ? <input
            className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border rounded px-2 py-1'
            type="text"
            value={userData.name}
            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
          />
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>
            {userData.name}
          </p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />

      {/* Contact Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit
            ? <input
                className='bg-gray-100 max-w-52 border rounded px-2'
                type="text"
                value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            : <p className='text-blue-400'>{userData.phone || "Not provided"}</p>
          }

          <p className='font-medium'>Address:</p>
          {isEdit
            ? <div className='flex flex-col gap-1'>
                <input
                  className='bg-gray-50 border rounded px-2 py-1'
                  type="text"
                  placeholder='Address line 1'
                  value={userData.address1}
                  onChange={e => setUserData(prev => ({ ...prev, address1: e.target.value }))}
                />
                <input
                  className='bg-gray-50 border rounded px-2 py-1'
                  type="text"
                  placeholder='Address line 2'
                  value={userData.address2}
                  onChange={e => setUserData(prev => ({ ...prev, address2: e.target.value }))}
                />
              </div>
            : <p className='text-gray-500'>
                {userData.address1 || "Not provided"}
                {userData.address2 && <><br />{userData.address2}</>}
              </p>
          }

        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>

          <p className='font-medium'>Gender:</p>
          {isEdit
            ? <select
                className='max-w-20 bg-gray-100 border rounded'
                value={userData.gender}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='text-gray-400'>{userData.gender || "Not provided"}</p>
          }

          <p className='font-medium'>Birthday:</p>
          {isEdit
            ? <input
                className='max-w-28 bg-gray-100 border rounded px-1'
                type='date'
                value={userData.dob}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            : <p className='text-gray-400'>{userData.dob || "Not provided"}</p>
          }

        </div>
      </div>

      {/* Buttons */}
      <div className='mt-10'>
        {isEdit
          ? <button
              className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all'
              onClick={saveProfile}>
              Save Information
            </button>
          : <button
              className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all'
              onClick={() => setIsEdit(true)}>
              Edit
            </button>
        }
      </div>

    </div>
  )
}

export default Myprofile